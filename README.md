# Voicebot Research

Prototyp konwersacyjnego voicebota przygotowany w ramach researchu narzędzi i rozwiązań do tworzenia asystentów głosowych.

## Cel projektu

Celem projektu jest porównanie gotowych rozwiązań voicebot oraz własnych pipeline'ów opartych o architekturę STT → LLM → TTS.

Każde rozwiązanie ma zostać sprawdzone pod kątem jakości rozmowy, szybkości odpowiedzi, obsługi języków, transkrypcji oraz generowania końcowego podsumowania.

## Aktualnie przetestowane rozwiązanie

OpenAI Realtime API.

Aktualny prototyp:
- prowadzi rozmowę głosową w czasie rzeczywistym,
- obsługuje język angielski, niemiecki i polski,
- umożliwia zmianę języka w trakcie rozmowy,
- wykrywa koniec wypowiedzi użytkownika,
- obsługuje przerywanie odpowiedzi przez użytkownika,
- ogranicza rozmowę do zadanego tematu,
- tworzy transkrypcję rozmowy,
- generuje końcowe podsumowanie rozmowy.

## Scenariusz testowy

Testowy voicebot prowadzi krótki wywiad dotyczący preferencji użytkownika związanych z weekendowym wyjazdem.

Bot zbiera informacje dotyczące:
- typu miejsca / celu wyjazdu,
- budżetu,
- transportu,
- noclegu,
- preferowanych aktywności.

Szczegółowy, wspólny scenariusz testów znajduje się w pliku `TEST_SCENARIO.md`.

Ten sam zestaw testów będzie wykorzystywany dla wszystkich kolejnych rozwiązań, aby możliwe było ich porównanie na takich samych warunkach.

## Wyniki testu OpenAI Realtime

W przeprowadzonych testach poprawnie działały:
- rozpoznawanie mowy,
- turn detection,
- barge-in,
- ograniczenie rozmowy do zadanego tematu,
- obsługa języka angielskiego,
- obsługa języka niemieckiego,
- zmiana języka w trakcie rozmowy,
- transkrypcja użytkownika i bota,
- generowanie końcowego podsumowania.

Średnie zmierzone latency wyniosło około 0,30 s.

## Planowane porównanie

### Gotowe rozwiązania voicebot

- OpenAI Realtime API
- Gemini Live API
- ElevenLabs Agents

### Własne pipeline'y

- Deepgram STT → OpenAI GPT → ElevenLabs TTS
- ElevenLabs STT → Gemini → ElevenLabs TTS
- Deepgram STT → Gemini → OpenAI TTS

## Parametry porównania

Każde rozwiązanie będzie oceniane pod kątem:
- latency,
- jakości rozpoznawania mowy,
- naturalności głosu,
- naturalności rozmowy,
- turn detection,
- barge-in,
- trzymania się zadanego tematu,
- obsługi języka angielskiego,
- obsługi języka niemieckiego,
- zmiany języka w trakcie rozmowy,
- kompletności transkrypcji,
- jakości końcowego podsumowania.

## Technologie

- Python
- FastAPI
- JavaScript
- WebRTC
- OpenAI Realtime API
- OpenAI Responses API

## Struktura projektu

voicebot-research/
├── static/
│   ├── index.html
│   └── app.js
├── app.py
├── requirements.txt
├── README.md
├── TEST_SCENARIO.md
└── .gitignore

## Uruchomienie

1. Utwórz środowisko wirtualne.

2. Zainstaluj zależności:

    pip install -r requirements.txt

3. Utwórz plik `.env` i dodaj:

    OPENAI_API_KEY=your_api_key

4. Uruchom aplikację:

    uvicorn app:app --reload

5. Otwórz w przeglądarce:

    http://127.0.0.1:8000

## Uwagi

Plik `.env` nie powinien być dodawany do repozytorium, ponieważ zawiera klucz API.