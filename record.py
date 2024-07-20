import pyaudio
import wave
import whisper
import openai
import torch
import time

# Set your OpenAI API key
openai.api_key = 'YOUR_OPENAI_API_KEY'

# Check if GPU is available and set device accordingly
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)


def record_audio(filename, duration=5, sample_rate=44100, channels=1):
    audio = pyaudio.PyAudio()
    stream = audio.open(format=pyaudio.paInt16, channels=channels, rate=sample_rate, input=True, frames_per_buffer=1024)
    frames = []

    print("Recording...")
    for _ in range(0, int(sample_rate / 1024 * duration)):
        data = stream.read(1024)
        frames.append(data)
    print("Finished recording.")

    stream.stop_stream()
    stream.close()
    audio.terminate()

    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
        wf.setframerate(sample_rate)
        wf.writeframes(b''.join(frames))

def transcribe_audio(filename):
    result = model.transcribe(filename)
    return result['text']

# def get_chatgpt_response(prompt):
#     response = openai.Completion.create(
#         engine="text-davinci-003",
#         prompt=prompt,
#         max_tokens=150
#     )
#     return response.choices[0].text.strip()

# Main function
def main():
    audio_file = "output.wav"
    record_audio(audio_file)

    start_time = time.time()  # Start time
    transcription = transcribe_audio(audio_file)
    end_time = time.time()    # End time
    
    time_taken = (end_time - start_time) * 1000  # Time taken in milliseconds
    print("Transcription:", transcription)
    print(f"Transcription Time: {time_taken:.2f} ms")

    start_time = time.time()  # Start time
    transcription = transcribe_audio(audio_file)
    end_time = time.time()    # End time
    
    time_taken = (end_time - start_time) * 1000  # Time taken in milliseconds
    print("Transcription:", transcription)
    print(f"Transcription Time: {time_taken:.2f} ms")

    start_time = time.time()  # Start time
    transcription = transcribe_audio(audio_file)
    end_time = time.time()    # End time
    
    time_taken = (end_time - start_time) * 1000  # Time taken in milliseconds
    print("Transcription:", transcription)
    print(f"Transcription Time: {time_taken:.2f} ms")
    # response = get_chatgpt_response(transcription)
    # print("ChatGPT Response:", response)

if __name__ == "__main__":
    main()
