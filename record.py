import pyaudio
import wave
import whisper
import openai
import torch
import collections
import webrtcvad
import numpy as np

# Set your OpenAI API key
openai.api_key = 'YOUR_OPENAI_API_KEY'

# Parameters
RATE = 16000
CHANNELS = 1
FRAME_DURATION_MS = 30
PADDING_DURATION_MS = 300
VAD_SENSITIVITY = 2  # 0, 1, 2, or 3. Increasing this makes VAD more sensitive.

vad = webrtcvad.Vad(VAD_SENSITIVITY)

# Check if GPU is available and set device accordingly
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)

# Helper function to record audio
def record_audio(duration=5):
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=CHANNELS,
                        rate=RATE, input=True, frames_per_buffer=int(RATE * FRAME_DURATION_MS / 1000))
    frames = []

    print("Recording...")
    for _ in range(0, int(RATE / (RATE * FRAME_DURATION_MS / 1000) * duration)):
        data = stream.read(int(RATE * FRAME_DURATION_MS / 1000))
        frames.append(data)
    print("Finished recording.")

    stream.stop_stream()
    stream.close()
    audio.terminate()

    return frames

def save_wave(frames, filename):
    audio = pyaudio.PyAudio()
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
        wf.setframerate(RATE)
        wf.writeframes(b''.join(frames))

def transcribe_audio(filename):
    result = model.transcribe(filename)
    return result['text']

def get_chatgpt_response(prompt):
    return "おッけー"
    # response = openai.Completion.create(
    #     engine="text-davinci-003",
    #     prompt=prompt,
    #     max_tokens=150
    # )
    # return response.choices[0].text.strip()

def vad_collector(sample_rate, frame_duration_ms, padding_duration_ms, vad, frames):
    num_padding_frames = padding_duration_ms // frame_duration_ms
    ring_buffer = collections.deque(maxlen=num_padding_frames)
    triggered = False

    voiced_frames = []
    for frame in frames:
        is_speech = vad.is_speech(frame, sample_rate)

        if not triggered:
            ring_buffer.append((frame, is_speech))
            num_voiced = len([f for f, speech in ring_buffer if speech])
            if num_voiced > 0.9 * ring_buffer.maxlen:
                triggered = True
                voiced_frames.extend([f for f, s in ring_buffer])
                ring_buffer.clear()
        else:
            voiced_frames.append(frame)
            ring_buffer.append((frame, is_speech))
            num_unvoiced = len([f for f, speech in ring_buffer if not speech])
            if num_unvoiced > 0.9 * ring_buffer.maxlen:
                triggered = False
                yield b''.join(voiced_frames)
                ring_buffer.clear()
                voiced_frames = []
    if voiced_frames:
        yield b''.join(voiced_frames)

def main():
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=CHANNELS,
                        rate=RATE, input=True, frames_per_buffer=int(RATE * FRAME_DURATION_MS / 1000))
    print("Listening... Press Ctrl+C to stop.")

    try:
        while True:
            frames = []
            for _ in range(0, int(RATE / (RATE * FRAME_DURATION_MS / 1000) * 10)):
                data = stream.read(int(RATE * FRAME_DURATION_MS / 1000))
                frames.append(data)

            frames = np.frombuffer(b''.join(frames), dtype=np.int16)
            frames = [frames[i:i + int(RATE * FRAME_DURATION_MS / 1000)] for i in range(0, len(frames), int(RATE * FRAME_DURATION_MS / 1000))]
            frames = [frame.tobytes() for frame in frames]

            for segment in vad_collector(RATE, FRAME_DURATION_MS, PADDING_DURATION_MS, vad, frames):
                filename = "output.wav"
                save_wave([segment], filename)
                transcription = transcribe_audio(filename)
                print("Transcription:", transcription)
                response = get_chatgpt_response(transcription)
                print("ChatGPT Response:", response)
    except KeyboardInterrupt:
        print("Stopped listening.")
    finally:
        stream.stop_stream()
        stream.close()
        audio.terminate()

if __name__ == "__main__":
    main()