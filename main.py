import eel
from audio import AudioTranscriptionEngine
from conversation import ConversationEngine

eel.init('web')

audio = AudioTranscriptionEngine()
conversation = ConversationEngine()

@eel.expose
def start_listening():
    print("Listening...")
    text = audio.listen()

    if text:
        conversation.send(text)

    return text

eel.start('index.html', size=(800, 600))
