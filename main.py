import eel
from audio import AudioTranscriptionEngine

eel.init('web')

audio = AudioTranscriptionEngine()

@eel.expose
def start_listening():
    print("Listening...")
    text = audio.listen()
    return text

eel.start('index.html', size=(800, 600))
