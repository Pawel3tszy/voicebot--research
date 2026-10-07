const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusEl = document.getElementById("status");
const transcriptEl = document.getElementById("transcript");
const summaryEl = document.getElementById("summary");
const languageSelect = document.getElementById("language");

let pc = null;
let dc = null;
let localStream = null;
let conversation = [];

let lastUserSpeechEnd = null;
let latencyMeasurements = [];

startBtn.addEventListener("click", startConversation);
stopBtn.addEventListener("click", stopConversation);

async function startConversation() {
    conversation = [];
    latencyMeasurements = [];
    lastUserSpeechEnd = null;

    transcriptEl.textContent = "";
    summaryEl.textContent = "";

    statusEl.textContent = "Status: łączenie...";

    const language = languageSelect.value;

    const tokenResponse = await fetch(
        `/token?language=${language}`
    );

    const tokenData = await tokenResponse.json();
    const ephemeralKey = tokenData.value;

    pc = new RTCPeerConnection();

    const audio = document.createElement("audio");
    audio.autoplay = true;

    pc.ontrack = (event) => {
        audio.srcObject = event.streams[0];
    };

    localStream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    dc = pc.createDataChannel("oai-events");

    dc.addEventListener("open", () => {
        statusEl.textContent = "Status: połączono";

        startBtn.disabled = true;
        stopBtn.disabled = false;
        languageSelect.disabled = true;
    });

    dc.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        // Koniec wypowiedzi użytkownika
        if (
            data.type ===
            "input_audio_buffer.speech_stopped"
        ) {
            lastUserSpeechEnd = performance.now();
        }

        // Pomiar latency
        if (
            data.type ===
            "response.output_audio_transcript.delta"
        ) {
            if (lastUserSpeechEnd !== null) {
                const latency =
                    performance.now() - lastUserSpeechEnd;

                latencyMeasurements.push(latency);

                console.log(
                    "Latency:",
                    (latency / 1000).toFixed(2),
                    "s"
                );

                lastUserSpeechEnd = null;
            }
        }

        // Transkrypcja użytkownika
        if (
            data.type ===
            "conversation.item.input_audio_transcription.completed"
        ) {
            const text = data.transcript;

            transcriptEl.textContent +=
                "USER: " + text + "\n";

            conversation.push({
                role: "user",
                text: text
            });
        }

        // Transkrypcja bota
        if (
            data.type ===
            "response.output_audio_transcript.done"
        ) {
            const text = data.transcript;

            transcriptEl.textContent +=
                "BOT: " + text + "\n";

            conversation.push({
                role: "assistant",
                text: text
            });
        }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const response = await fetch(
        "https://api.openai.com/v1/realtime/calls",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ephemeralKey}`,
                "Content-Type": "application/sdp"
            },
            body: offer.sdp
        }
    );

    const answer = {
        type: "answer",
        sdp: await response.text()
    };

    await pc.setRemoteDescription(answer);
}

async function stopConversation() {
    if (dc) {
        dc.close();
    }

    if (pc) {
        pc.close();
    }

    if (localStream) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    pc = null;
    dc = null;
    localStream = null;

    statusEl.textContent = "Status: generowanie podsumowania...";

    startBtn.disabled = false;
    stopBtn.disabled = true;
    languageSelect.disabled = false;

    console.log("Pełna rozmowa:");
    console.log(conversation);

    if (latencyMeasurements.length > 0) {
        const averageLatency =
            latencyMeasurements.reduce(
                (sum, value) => sum + value,
                0
            ) / latencyMeasurements.length;

        console.log(
            "Średnie latency:",
            (averageLatency / 1000).toFixed(2),
            "s"
        );
    } else {
        console.log("Brak pomiarów latency.");
    }

    const response = await fetch("/summary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            conversation: conversation,
            language: languageSelect.value
        })
    });

    const data = await response.json();

    if (data.summary) {
        summaryEl.textContent = data.summary;
        statusEl.textContent = "Status: zakończono";
    } else {
        summaryEl.textContent =
            "Nie udało się wygenerować podsumowania.";

        console.error(data);

        statusEl.textContent = "Status: błąd";
    }
}