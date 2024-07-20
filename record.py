import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

import pyaudio
import webrtcvad
import queue
import torch
from faster_whisper import WhisperModel
import numpy as np
import time

last_time = time.time()
def tPrint(message):
    global last_time
    out = (time.time() - last_time)*1000
    last_time = time.time()
    print(f"[{out:.2f}ms] {message}")

# Initialize Whisper model with CUDA support
model = WhisperModel("large-v2", device="cuda", compute_type="float16")

# Initialize PyAudio and WebRTC VAD
SAMPLE_RATE = 16000
FRAME_DURATION_MS = 30  # Frame duration in milliseconds (10, 20, or 30 ms)
FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)  # Frame size in samples
MAX_SECONDS = 10
SILENCE_TIMEOUT = 1

audio_interface = pyaudio.PyAudio()
vad = webrtcvad.Vad()
vad.set_mode(3)  # Adjust VAD aggressiveness (0-3)

audio_queue = queue.Queue()

def get_audio_input():
    stream = audio_interface.open(format=pyaudio.paInt16,
                                  channels=1, # 1 for mono
                                  rate=SAMPLE_RATE,
                                  input=True,
                                  frames_per_buffer=FRAME_SIZE)
    return stream

def is_speech(frame):
    return vad.is_speech(frame, SAMPLE_RATE)

def process_audio():
    stream = get_audio_input()

    frames = []

    start_time = time.time()
    last_voice_time = None
    while time.time()-start_time < MAX_SECONDS:
        data=stream.read(FRAME_SIZE)
        if vad.is_speech(data, SAMPLE_RATE):
            # print("Frame is speech")
            frames.append(data)
            last_voice_time = time.time()
        # else:
            # print("Frame is not speech")
        if last_voice_time and time.time() - last_voice_time > SILENCE_TIMEOUT:
            break
    return b''.join(frames)

def transcribe_audio(audio_data):
    audio_array = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
    segments, _ = model.transcribe(audio_array, beam_size=5, language="ja")
    return ' '.join([segment.text for segment in segments])

def chat_with_gpt(prompt):
    return "テスト"
    # response = openai.Completion.create(
    #     engine="davinci-codex",
    #     prompt=prompt,
    #     max_tokens=150
    # )
    # return response.choices[0].text.strip()

def main():
    tPrint("Listening...")
    while True:
        tPrint(f"Start listening")
        audio_data = process_audio()
        if audio_data:
            tPrint("Start transcribing")
            transcript = transcribe_audio(audio_data)
            tPrint(f"User: {transcript}")
            response = chat_with_gpt(transcript)
            tPrint(f"ChatGPT: {response}")

if __name__ == "__main__":
    main()