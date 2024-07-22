import eel
from audio import AudioTranscriptionEngine
from conversation import ConversationEngine

eel.init('web-src/build')

audio = AudioTranscriptionEngine()
conversation = ConversationEngine()

@eel.expose
def start_listening():
    print("Listening...")
    audio_data = audio.listen()

    if audio_data:
        eel.setProcessingState('文字お越し中…')
        text = audio.transcribe_audio(audio_data)

        if text:
            conversation.addUserMessage(text)
            eel.setMessages(conversation.getMessages())
            eel.setProcessingState('出力中…')
            response = conversation.process()

            return conversation.getMessages()

    eel.setProcessingState('')
    return None

@eel.expose
def get_messages():
    return conversation.getMessages()


eel.start('index.html', size=(800, 600), cmdline_args=['--disable-extensions'])
