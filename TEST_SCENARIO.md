# Voicebot Test Scenario

## Cel testu

Każde rozwiązanie voicebota jest testowane według tego samego scenariusza.

Tematem rozmowy jest krótki wywiad dotyczący preferencji użytkownika związanych z weekendowym wyjazdem.

Bot powinien zebrać następujące informacje:

1. typ miejsca / cel wyjazdu,
2. budżet,
3. sposób transportu,
4. preferowany nocleg,
5. preferowane aktywności.

---

## Podstawowy przebieg rozmowy

### 1. Destination

User:

I would like to spend the weekend in the mountains.

### 2. Budget

User:

My budget is about 300 euros.

### 3. Transport

User:

I would prefer to travel by train.

### 4. Accommodation

User:

I would like to stay in a small guesthouse.

### 5. Activities

User:

I would like to go hiking and visit some local attractions.

---

## Dodatkowe testy funkcjonalne

### Turn detection

Podczas jednej z wypowiedzi użytkownik robi około 1 sekundy pauzy w środku zdania.

Przykład:

I would like to travel by train... [pauza około 1 s] ...because I do not like driving.

Sprawdzamy, czy bot nie uzna zbyt szybko wypowiedzi za zakończoną.

---

### Barge-in

Podczas wypowiedzi bota użytkownik zaczyna mówić.

Sprawdzamy:

- czy bot przerywa swoją wypowiedź,
- czy zaczyna słuchać użytkownika,
- czy poprawnie uwzględnia nową wypowiedź.

---

### Zmiana wcześniejszej odpowiedzi

User:

Actually, I changed my mind. I would rather go to the seaside.

Sprawdzamy, czy bot aktualizuje wcześniej zebraną informację i nie opiera dalszej rozmowy na starej odpowiedzi.

---

### Off-topic

User:

Who won the Champions League?

Bot nie powinien odpowiadać na pytanie niezwiązane z zakresem rozmowy.

Powinien krótko poinformować użytkownika, że rozmowa dotyczy wyłącznie tematu wyjazdu, a następnie wrócić do wywiadu.

---

### Zmiana języka

Rozmowa rozpoczyna się po angielsku.

User:

Can we continue in German?

Następnie część rozmowy prowadzona jest po niemiecku.

Sprawdzamy, czy bot płynnie zmienia język w trakcie tej samej rozmowy.

---

## Test językowy

Pełny podstawowy scenariusz wykonywany jest osobno:

- w języku angielskim,
- w języku niemieckim.

Polski może być dodatkowo używany podczas testów pomocniczych.

---

## Parametry oceniane podczas testu

Dla każdego rozwiązania sprawdzamy:

- latency,
- jakość rozpoznawania mowy STT,
- naturalność głosu,
- naturalność rozmowy,
- turn detection,
- barge-in,
- trzymanie się zadanego tematu,
- jakość rozmowy po angielsku,
- jakość rozmowy po niemiecku,
- zmianę języka w trakcie rozmowy,
- kompletność transkrypcji,
- poprawność końcowego podsumowania.

---

## Po zakończeniu rozmowy

Sprawdzamy:

- czy transkrypcja zawiera wypowiedzi użytkownika i bota,
- czy kolejność wypowiedzi jest poprawna,
- czy rozpoznane informacje są zgodne z rozmową,
- czy podsumowanie zawiera wszystkie zebrane informacje,
- czy podsumowanie nie zawiera informacji, których użytkownik nie podał,
- czy podsumowanie jest wygenerowane w odpowiednim języku.