import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

import webrtcvad
import pyaudio
import time
import numpy
from faster_whisper import WhisperModel

# Initialize PyAudio and WebRTC VAD
SAMPLE_RATE = 16000
FRAME_DURATION_MS = 30  # Frame duration in milliseconds (10, 20, or 30 ms)
FRAME_SIZE = int(SAMPLE_RATE * FRAME_DURATION_MS / 1000)  # Frame size in samples
MAX_SECONDS = 60
SILENCE_TIMEOUT = 1

class AudioTranscriptionEngine:
    def __init__(self):
        self.model =  WhisperModel("large-v2", device="cuda", compute_type="float16")
        self.vad = webrtcvad.Vad()
        self.vad.set_mode(3)  # Adjust VAD aggressiveness (0-3)
        self.audio_interface = pyaudio.PyAudio()

    def listen(self):
        audio_data = self.process_audio()
        if audio_data:
            transcript = self.transcribe_audio(audio_data)
            return transcript
        else:
            return None

    def get_audio_input(self):
        stream = self.audio_interface.open(format=pyaudio.paInt16,
                                           channels=1, # 1 for mono
                                           rate=SAMPLE_RATE,
                                           input=True,
                                           frames_per_buffer=FRAME_SIZE)
        return stream

    def is_speech(self, frame):
        return self.vad.is_speech(frame, SAMPLE_RATE)

    def process_audio(self):
        stream = self.get_audio_input()

        frames = []

        start_time = time.time()
        last_voice_time = None
        while time.time()-start_time < MAX_SECONDS:
            data=stream.read(FRAME_SIZE)
            if self.is_speech(data):
                frames.append(data)
                last_voice_time = time.time()
            if last_voice_time and time.time() - last_voice_time > SILENCE_TIMEOUT:
                break
        return b''.join(frames)

    def transcribe_audio(self, audio_data):
        audio_array = numpy.frombuffer(audio_data, dtype=numpy.int16).astype(numpy.float32) / 32768.0
        segments, _ = self.model.transcribe(audio_array, beam_size=5, language="ja")
        return ' '.join([segment.text for segment in segments])
