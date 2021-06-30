
class Mario {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3504, 64, 16, 16) // Mario na starcie przyjmuje animacje stania w prawo
        this.animacja = {

            poruszaniePrawo: {
                klatka: [new Obraz(img, 3424, 64, 16, 16),
                new Obraz(img, 3408, 64, 16, 16),
                new Obraz(img, 3424, 64, 16, 16),
                new Obraz(img, 3440, 64, 16, 16)],
                obecnaKlatka: 0
            },

            poruszanieLewo: {
                klatka: [new Obraz(img, 3424, 80, 16, 16),
                new Obraz(img, 3408, 80, 16, 16),
                new Obraz(img, 3424, 80, 16, 16),
                new Obraz(img, 3440, 80, 16, 16)],
                obecnaKlatka: 0
            },

            staniePrawo: new Obraz(img, 3504, 64, 16, 16),
            stanieLewo: new Obraz(img, 3504, 80, 16, 16),
            skokPrawo: new Obraz(img, 3472, 64, 16, 16),
            skokLewo: new Obraz(img, 3472, 80, 16, 16),
            smierc: new Obraz(img, 3488, 64, 16, 16),
            spuszczaniePrawo: new Obraz(img, 3456, 64, 16, 16),
            spuszczanieLewo: new Obraz(img, 3456, 80, 16, 16)
        }

        this.animacjaDuzy = {

            poruszaniePrawo: {
                klatka: [new Obraz(img, 3424, 0, 16, 32),
                new Obraz(img, 3408, 0, 16, 32),
                new Obraz(img, 3424, 0, 16, 32),
                new Obraz(img, 3440, 0, 16, 32)],
                obecnaKlatka: 0
            },

            poruszanieLewo: {
                klatka: [new Obraz(img, 3520, 0, 16, 32),
                new Obraz(img, 3504, 0, 16, 32),
                new Obraz(img, 3520, 0, 16, 32),
                new Obraz(img, 3536, 0, 16, 32)],
                obecnaKlatka: 0
            },

            miganiePrawo: {
                klatka: [new Obraz(img, 3488, 0, 16, 32),
                new Obraz(img, 3520, 64, 16, 32)], // pusta klatka (brak obrazu - bezbarwny)
                obecnaKlatka: 0
            },

            miganieLewo: {
                klatka: [new Obraz(img, 3584, 0, 16, 32),
                new Obraz(img, 3520, 64, 16, 32)], // pusta klatka (brak obrazu - bezbarwny)
                obecnaKlatka: 0
            },

            staniePrawo: new Obraz(img, 3488, 0, 16, 32),
            stanieLewo: new Obraz(img, 3584, 0, 16, 32),
            skokPrawo: new Obraz(img, 3472, 0, 16, 32),
            skokLewo: new Obraz(img, 3568, 0, 16, 32),
            spuszczaniePrawo: new Obraz(img, 3456, 0, 16, 32),
            spuszczanieLewo: new Obraz(img, 3552, 0, 16, 32)
        }

        this.animacjaStrzelanie = {

            poruszaniePrawo: {
                klatka: [new Obraz(img, 3424, 32, 16, 32),
                new Obraz(img, 3408, 32, 16, 32),
                new Obraz(img, 3424, 32, 16, 32),
                new Obraz(img, 3440, 32, 16, 32)],
                obecnaKlatka: 0
            },

            poruszanieLewo: {
                klatka: [new Obraz(img, 3520, 32, 16, 32),
                new Obraz(img, 3504, 32, 16, 32),
                new Obraz(img, 3520, 32, 16, 32),
                new Obraz(img, 3536, 32, 16, 32)],
                obecnaKlatka: 0
            },

            miganiePrawo: {
                klatka: [new Obraz(img, 3488, 32, 16, 32),
                new Obraz(img, 3520, 64, 16, 32)], // pusta klatka (brak obrazu - bezbarwny)
                obecnaKlatka: 0
            },

            miganieLewo: {
                klatka: [new Obraz(img, 3584, 32, 16, 32),
                new Obraz(img, 3520, 64, 16, 32)], // pusta klatka (brak obrazu - bezbarwny)
                obecnaKlatka: 0
            },

            staniePrawo: new Obraz(img, 3488, 32, 16, 32),
            stanieLewo: new Obraz(img, 3584, 32, 16, 32),
            skokPrawo: new Obraz(img, 3472, 32, 16, 32),
            skokLewo: new Obraz(img, 3568, 32, 16, 32),
            spuszczaniePrawo: new Obraz(img, 3456, 32, 16, 32),
            spuszczanieLewo: new Obraz(img, 3552, 32, 16, 32)
        }

        this.stan = {
            stanie: {
                ruch: (data) => {
                    return
                },
                animacja: (data) => {
                    var animacja = this.animacja
                    if (this.mozeStrzelac) {
                        animacja = this.animacjaStrzelanie
                        this.h = 2 * h - 1
                    } else if (this.mozeNiszczyc) {
                        animacja = this.animacjaDuzy
                        this.h = 2 * h - 1
                    } else {
                        this.h = h
                    }
                    if (this.kierunek == "prawo") {
                        this.obraz = animacja.staniePrawo
                    } else this.obraz = animacja.stanieLewo
                }
            },

            skakanie: { // nie tylko skakanie ale rowniez spadanie

                ruch: (data) => {
                    if (this.pedY == 0) {
                        this.pedY -= 23.5 // nie moze byc int bo Mario zamiast spadac bedzie dalej sie wznosic (w szczytowym momencie skoku (gdy Mario znajduje sie najwyzej) to jego ped wyrownalby sie do 0 i nastapiloby ponowienie skoku)
                        if (!this.wyciszenie) {
                            data.audio.skok.pause() // zapobiega zbyt poznemu odegraniu dzwieku w przypadku drugiego szybkiego skoku (domyslnie audio zostaloby odegrane dopiero po skonczeniu odegrania pierwszego dzwieku w calosci)
                            data.audio.skok.currentTime = 0 // przewiniecie biezacej pozycji dzwieku na poczatek
                            data.audio.skok.play()
                        }
                    }
                    this.kontrolerRuchu(data)
                },

                animacja: (data) => {
                    var animacja = this.animacja
                    if (this.mozeStrzelac) {
                        animacja = this.animacjaStrzelanie
                        this.h = 2 * h - 1
                    } else if (this.mozeNiszczyc) {
                        animacja = this.animacjaDuzy
                        this.h = 2 * h - 1
                    } else {
                        this.h = h
                    }
                    if (this.kierunek == "prawo") {
                        this.obraz = animacja.skokPrawo
                    } else this.obraz = animacja.skokLewo
                }
            },

            poruszanie: {

                ruch: (data) => {
                    this.kontrolerRuchu(data)
                },

                animacja: (data) => {
                    var animacja = this.animacja
                    if (this.mozeStrzelac) {
                        animacja = this.animacjaStrzelanie
                        this.h = 2 * h - 1
                    } else if (this.mozeNiszczyc) {
                        animacja = this.animacjaDuzy
                        this.h = 2 * h - 1
                    } else {
                        this.h = h
                    }

                    if (this.kierunek == "prawo") {
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = animacja.poruszaniePrawo.klatka[animacja.poruszaniePrawo.obecnaKlatka]
                            animacja.poruszaniePrawo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (animacja.poruszaniePrawo.obecnaKlatka > 3) {
                            animacja.poruszaniePrawo.obecnaKlatka = 0
                        }
                    } else { // w lewo
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = animacja.poruszanieLewo.klatka[animacja.poruszanieLewo.obecnaKlatka]
                            animacja.poruszanieLewo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (animacja.poruszanieLewo.obecnaKlatka > 3) {
                            animacja.poruszanieLewo.obecnaKlatka = 0
                        }
                    }
                }
            },

            miganie: {

                ruch: (data) => {
                    this.pedX = 0
                    this.pedY = 0
                },

                animacja: (data) => {
                    var animacja = this.animacja
                    if (this.mozeStrzelac) {
                        animacja = this.animacjaStrzelanie
                        //this.h = 2 * h - 1 // i tak wysokosc bedzie 2 razy wieksza z poprzedniego stanu wiec linijka raczej nic nie wnosi...
                    } else if (this.mozeNiszczyc) {
                        animacja = this.animacjaDuzy
                        //this.h = 2 * h - 1
                    }
                    if (this.kierunek == "prawo") {
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = animacja.miganiePrawo.klatka[animacja.miganiePrawo.obecnaKlatka]
                            animacja.miganiePrawo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (animacja.miganiePrawo.obecnaKlatka > 1) {
                            animacja.miganiePrawo.obecnaKlatka = 0
                        }
                    } else { // w lewo
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = animacja.miganieLewo.klatka[animacja.miganieLewo.obecnaKlatka]
                            animacja.miganieLewo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (animacja.miganieLewo.obecnaKlatka > 1) {
                            animacja.miganieLewo.obecnaKlatka = 0
                        }
                    }
                }
            },

            smierc: { // na skutek kontaktu z potworem
                ruch: (data) => {
                    this.pedX = 0
                },
                animacja: (data) => {
                    this.h = h // na wszelki wypadek
                    this.obraz = this.animacja.smierc
                }
            },

            spuszczanie: {
                ruch: (data) => {
                    return
                },
                animacja: (data) => {
                    var animacja = this.animacja
                    if (this.mozeStrzelac) {
                        animacja = this.animacjaStrzelanie
                        this.h = 2 * h - 1
                    } else if (this.mozeNiszczyc) {
                        animacja = this.animacjaDuzy
                        this.h = 2 * h - 1
                    } else {
                        this.h = h
                    }
                    if (this.kierunek == "lewo") this.obraz = animacja.spuszczanieLewo
                    else this.obraz = animacja.spuszczaniePrawo
                }
            }
        }

        this.obecnyStan = this.stan.stanie
        this.kierunek = "prawo"
        this.typ = "mario"
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pedY = 1
        this.pedX = 8
        this.zycia = 3
        this.momentSmierci = false
        this.monety = 0
        this.momentZwyciestwa = false
        this.mozeNiszczyc = false
        this.mozeStrzelac = false
        this.naladowany = true
        this.wyciszenie = false
    }

    kontrolerRuchu(data) {
        if (((this.x - this.pedX <= data.canvas.fg.width / 2 || data.obiekty.mapa.x - this.pedX < data.canvas.fg.width - data.obiekty.mapa.w) && this.kierunek == "prawo") || ((this.x - this.pedX > data.canvas.fg.width / 2 || data.obiekty.mapa.x - this.pedX >= 0) && this.kierunek == "lewo")) {
            this.x += this.pedX
        } else {
            data.obiekty.mapa.x -= this.pedX
            // obiekty kolizji tez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaScian.length; i++) {
                data.obiekty.tabelaScian[i].x -= this.pedX
            }
            // potwory rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPotworow.length; i++) {
                data.obiekty.tabelaPotworow[i].x -= this.pedX
            }
            // monety rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaMonet.length; i++) {
                data.obiekty.tabelaMonet[i].x -= this.pedX
            }
            // bloczki monet rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaBloczkowMonet.length; i++) {
                data.obiekty.tabelaBloczkowMonet[i].x -= this.pedX
                data.obiekty.tabelaBloczkowMonet[i].moneta.x -= this.pedX
            }
            // platformy rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPlatform.length; i++) {
                data.obiekty.tabelaPlatform[i].x -= this.pedX
            }
            // zolwie rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaZolwi.length; i++) {
                data.obiekty.tabelaZolwi[i].x -= this.pedX
            }
            if (data.level == "level2") {
                // bloczki cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowCegiel.length; i++) {
                    data.obiekty.tabelaBloczkowCegiel[i].x -= this.pedX
                }
                // fragmenty cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaFragmentowCegiel.length; i++) {
                    data.obiekty.tabelaFragmentowCegiel[i].x -= this.pedX
                }
                // bloczki grzybow rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowGrzybow.length; i++) {
                    data.obiekty.tabelaBloczkowGrzybow[i].x -= this.pedX
                }
                // grzyby rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaGrzybow.length; i++) {
                    data.obiekty.tabelaGrzybow[i].x -= this.pedX
                }
                // bloczki kruche rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowKruchych.length; i++) {
                    data.obiekty.tabelaBloczkowKruchych[i].x -= this.pedX
                }
                // pociski rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaPociskow.length; i++) {
                    data.obiekty.tabelaPociskow[i].x -= this.pedX
                }
                // slupki rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaSlupkow.length; i++) {
                    data.obiekty.tabelaSlupkow[i].x -= this.pedX
                    data.obiekty.tabelaSlupkow[i].flaga.x -= this.pedX
                }
            }
        }
    }

    kontrolerRuchuNaPlatformiePrawo(data) {
        if (this.x - this.pedX <= data.canvas.fg.width / 2 || data.obiekty.mapa.x - this.pedX < data.canvas.fg.width - data.obiekty.mapa.w) {
            this.x += this.pedX
        } else {
            data.obiekty.mapa.x -= this.pedX
            // obiekty kolizji tez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaScian.length; i++) {
                data.obiekty.tabelaScian[i].x -= this.pedX
            }
            // potwory rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPotworow.length; i++) {
                data.obiekty.tabelaPotworow[i].x -= this.pedX
            }
            // monety rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaMonet.length; i++) {
                data.obiekty.tabelaMonet[i].x -= this.pedX
            }
            // bloczki monet rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaBloczkowMonet.length; i++) {
                data.obiekty.tabelaBloczkowMonet[i].x -= this.pedX
                data.obiekty.tabelaBloczkowMonet[i].moneta.x -= this.pedX
            }
            // platformy rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPlatform.length; i++) {
                data.obiekty.tabelaPlatform[i].x -= this.pedX
            }
            // zolwie rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaZolwi.length; i++) {
                data.obiekty.tabelaZolwi[i].x -= this.pedX
            }
            if (data.level == "level2") {
                // bloczki cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowCegiel.length; i++) {
                    data.obiekty.tabelaBloczkowCegiel[i].x -= this.pedX
                }
                // fragmenty cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaFragmentowCegiel.length; i++) {
                    data.obiekty.tabelaFragmentowCegiel[i].x -= this.pedX
                }
                // bloczki grzybow rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowGrzybow.length; i++) {
                    data.obiekty.tabelaBloczkowGrzybow[i].x -= this.pedX
                }
                // grzyby rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaGrzybow.length; i++) {
                    data.obiekty.tabelaGrzybow[i].x -= this.pedX
                }
                // bloczki kruche rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowKruchych.length; i++) {
                    data.obiekty.tabelaBloczkowKruchych[i].x -= this.pedX
                }
                // pociski rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaPociskow.length; i++) {
                    data.obiekty.tabelaPociskow[i].x -= this.pedX
                }
                // slupki rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaSlupkow.length; i++) {
                    data.obiekty.tabelaSlupkow[i].x -= this.pedX
                    data.obiekty.tabelaSlupkow[i].flaga.x -= this.pedX
                }
            }
        }
    }

    kontrolerRuchuNaPlatformieLewo(data) {
        if (this.x - this.pedX > data.canvas.fg.width / 2 || data.obiekty.mapa.x - this.pedX >= 0) {
            this.x += this.pedX
        } else {
            data.obiekty.mapa.x -= this.pedX
            // obiekty kolizji tez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaScian.length; i++) {
                data.obiekty.tabelaScian[i].x -= this.pedX
            }
            // potwory rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPotworow.length; i++) {
                data.obiekty.tabelaPotworow[i].x -= this.pedX
            }
            // monety rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaMonet.length; i++) {
                data.obiekty.tabelaMonet[i].x -= this.pedX
            }
            // bloczki monet rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaBloczkowMonet.length; i++) {
                data.obiekty.tabelaBloczkowMonet[i].x -= this.pedX
                data.obiekty.tabelaBloczkowMonet[i].moneta.x -= this.pedX
            }
            // platformy rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaPlatform.length; i++) {
                data.obiekty.tabelaPlatform[i].x -= this.pedX
            }
            // zolwie rowniez trzeba przesunac
            for (var i = 0; i < data.obiekty.tabelaZolwi.length; i++) {
                data.obiekty.tabelaZolwi[i].x -= this.pedX
            }
            if (data.level == "level2") {
                // bloczki cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowCegiel.length; i++) {
                    data.obiekty.tabelaBloczkowCegiel[i].x -= this.pedX
                }
                // fragmenty cegiel rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaFragmentowCegiel.length; i++) {
                    data.obiekty.tabelaFragmentowCegiel[i].x -= this.pedX
                }
                // bloczki grzybow rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowGrzybow.length; i++) {
                    data.obiekty.tabelaBloczkowGrzybow[i].x -= this.pedX
                }
                // grzyby rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaGrzybow.length; i++) {
                    data.obiekty.tabelaGrzybow[i].x -= this.pedX
                }
                // bloczki kruche rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaBloczkowKruchych.length; i++) {
                    data.obiekty.tabelaBloczkowKruchych[i].x -= this.pedX
                }
                // pociski rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaPociskow.length; i++) {
                    data.obiekty.tabelaPociskow[i].x -= this.pedX
                }
                // slupki rowniez trzeba przesunac
                for (var i = 0; i < data.obiekty.tabelaSlupkow.length; i++) {
                    data.obiekty.tabelaSlupkow[i].x -= this.pedX
                    data.obiekty.tabelaSlupkow[i].flaga.x -= this.pedX
                }
            }
        }
    }
}