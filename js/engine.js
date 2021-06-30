
window.onload = () => {
    this.G = new Game() // tworzenie obiektu glownego
    G.start() // trigerowanie timera

    // rysowanie legendy
    var grafika = new Image()
    grafika.src = "img/stylesheet2.png"
    var canvas = document.getElementById("legend")
    var ctx = canvas.getContext("2d")
    setTimeout(() => { // bez opoznienia czasowego nie chce to dzialac...

        // obrazy
        ctx.drawImage(grafika, 3504, 64, 16, 16, 0, 0, 48, 48) // mario
        ctx.drawImage(grafika, 3408, 112, 16, 16, 0, 48 + 8, 48, 48) // moneta
        ctx.drawImage(grafika, 3408, 96, 16, 16, 0, 2 * (48 + 8), 48, 48) // potwor
        ctx.drawImage(grafika, 3456, 136, 16, 24, 0, 3 * (48 + 8), 48, 48) // zolw
        ctx.drawImage(grafika, 3408, 128, 16, 16, 0, 4 * (48 + 8), 48, 48) // bloczekGrzybow
        ctx.drawImage(grafika, 3424, 144, 16, 16, 0, 5 * (48 + 8), 48, 48) // grzybZycie
        ctx.drawImage(grafika, 3408, 144, 16, 16, 0, 6 * (48 + 8), 48, 48) // grzybPowiekszenie
        ctx.drawImage(grafika, 3440, 144, 16, 16, 0, 7 * (48 + 8), 48, 48) // grzybStrzelanie
        ctx.drawImage(grafika, 3408, 128, 16, 16, 0, 8 * (48 + 8), 48, 48) // bloczekMonet
        ctx.drawImage(grafika, 3424, 160, 16, 16, 0, 9 * (48 + 8), 48, 48) // bloczekKruchy
        ctx.drawImage(grafika, 3440, 128, 16, 16, 0, 10 * (48 + 8), 48, 48) // bloczekCegiel
        ctx.drawImage(grafika, 3568, 192, 16, 16, 0, 11 * (48 + 8), 48, 48) // flaga

        // opisy
        var opis = "Mario - moving: LEFT ARROW and RIGHT ARROW, jumping: UP ARROW or SPACE, shooting: CTRL<br />" +
            "<br />Coin - collect all to finish the level<br /><br />" +
            "<br />Monster - avoid it as hell, you can kill it by the fire ball<br />" +
            "<br />Turtle - you can kill it by jumping on it from the top or by the fire ball<br />" +
            "<br />Coin block - you can get the coins by hitting on it from the bottom<br />" +
            "<br />Life Mushroom - it gives you an extra life<br />" +
            "<br />Gaining Mushroom - it gains your size twice and gives you an ability to destroy some kind of blocks<br />" +
            "<br />Shooting Mushroom - it gives you an ability to shooting with fire balls" +
            "<br />Mushroom block - you can release a mushroom by hitting on it from the bottom<br />" +
            "<br />Fragile block - you can destroy it if you are big enough<br />" +
            "<br />Brick block - you can destroy it if you are big enough but only from the bottom" +
            "<br />Flag - you can collect 100 coins by jumping on it from the top<br /><br />"
        document.getElementById("description").innerHTML = opis

    }, 100) // w miare optymalny interwal, nie moze byc za szybko bo moze nie zadzialac czasami, a za wolno tez nie bo slaby efekt..
}

class Game {
    constructor() {
        // import wszystkich danych przygotowanych w momencie utworzenia obiektu G do globalnej zmiennej data dostepnej w calej klasie Game
        this.data = this.prepare()
        this.level2 = this.prepare2()

        // tymczasowe zalaczenie flag w celach testowych - po zakonczeniu do wywalenia (ewentualnie zakomentowania)
        //this.data.obiekty.mario.mozeNiszczyc = true
        //this.data.obiekty.mario.mozeStrzelac = true

        // flagi potrzebne do metody render()
        this.flaga = true // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz, uzywana tylko w 1 miejscu ze wzgledow bezpieczenstwa
        this.flaga2 = true // informacja o levelu
        this.flaga3 = true // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz, uzywana w wielu miejscach
        this.flagaZycie = false
        this.flagaPowiekszenie = false
        this.flagaStrzelanie = false

        this.blokadaRuchu = false // flaga potrzebna do metod kolizja() oraz input()
        this.interakcja = false  // flaga potrzebna aby muzyczka wlaczala sie po dokonaniu interakcji przez gracza
        this.wyciszenie = false // flaga potrzebna do buttona do wyciszenia globalnego dzwieku gry

        this.melodia = new Audio("audio/theme_melody.mp3") // melodia glowna
        this.slider = document.getElementById("myRange") // uchwyt do slidera

        // wylaczenie wygladzania grafiki (sprawia ze obraz jest ostry i nie tylko)
        this.data.ctx.sky.imageSmoothingEnabled = false
        this.data.ctx.bg.imageSmoothingEnabled = false
        this.data.ctx.fg.imageSmoothingEnabled = false

        // sterowanie (input)
        document.onkeydown = (event) => {
            this.nacisniety[event.keyCode] = true // przypisuje danemu indeksowi tablicy o numerze keyCode wartosc true gdy przycisk jest wciskany
        }
        document.onkeyup = (event) => {
            this.nacisniety[event.keyCode] = false // przypisuje danemu indeksowi tablicy o numerze keyCode wartosc false gdy przycisk jest puszczany
        }
        this.nacisniety = {} // tablica przechowujaca informacje o tym ktory przycisk jest aktualnie naciskany (keyCode przycisku jest indeksem, a odpowiadajaca mu wartosc jest typu boolian)
    }

    start() { // timer gry
        setInterval(() => { // alternatywa dla timera window.requestAnimationFrame(this.start()), ktory na poziomie obiektowym zaczal sie krzaczyc...
            this.input()
            this.update()
            this.fizyka()
            this.render()
            this.changeVolume()
            this.data.nrKlatki++
        }, 22)
    }

    input() {

        // przegladarki blokuja mozliwosc odpalenia dzwieku w momencie odswiezenia dlatego muzyczka wlaczy sie dopiero po dokonaniu interakcji przez gracza
        if (!this.interakcja && (this.nacisnieto(39) || this.nacisnieto(37) || this.nacisnieto(38) || this.nacisnieto(32))) {
            this.interakcja = true
            this.melodia.loop = true // sprawia ze glowna melodia bedzie odgrywana bez konca (domyslnie jest jednorazowo)
            this.melodia.play()
        }

        var mario = this.data.obiekty.mario

        // prawa strzalka
        if (this.nacisnieto(39) && !mario.momentSmierci && mario.obecnyStan != mario.stan.miganie && !this.blokadaRuchu) {
            mario.kierunek = "prawo"
            if (mario.obecnyStan != mario.stan.spuszczanie) {
                mario.pedX = 8
                if (mario.pedY == 0) {
                    mario.obecnyStan = mario.stan.poruszanie
                } else {
                    mario.obecnyStan = mario.stan.skakanie
                }
            }
        }

        // lewa strzalka
        else if (this.nacisnieto(37) && !mario.momentSmierci && mario.obecnyStan != mario.stan.miganie && !this.blokadaRuchu) {
            mario.kierunek = "lewo"
            if (mario.obecnyStan != mario.stan.spuszczanie) {
                mario.pedX = -8
                if (mario.pedY == 0) {
                    mario.obecnyStan = mario.stan.poruszanie
                } else {
                    mario.obecnyStan = mario.stan.skakanie
                }
            }
        }

        // gdy nic nie jest nacisniete
        else if (!this.blokadaRuchu) {
            mario.pedX = 0
        }

        // strzalka w gore lub spacja - skok
        if ((this.nacisnieto(38) || this.nacisnieto(32)) && !mario.momentSmierci && mario.obecnyStan != mario.stan.miganie && mario.obecnyStan != mario.stan.spuszczanie) { // 38 - strzalka w gore, 32 - spacja
            mario.obecnyStan = mario.stan.skakanie
        }

        // strzelanie - CTRL
        if (this.nacisnieto(17) && !mario.momentSmierci && mario.obecnyStan != mario.stan.miganie && mario.obecnyStan != mario.stan.spuszczanie) {
            if (mario.mozeStrzelac && mario.naladowany) {
                mario.naladowany = false
                // czestotliwosc strzelania
                setTimeout(() => {
                    mario.naladowany = true
                }, 600)
                let p = 10
                if (mario.kierunek == "prawo") p = 10
                else p = -10
                this.data.obiekty.tabelaPociskow.push(
                    new Pocisk(this.data.grafika, mario.x + mario.w / 2, mario.y + mario.h / 2, 24, 24, p)
                )
            }
        }
    }

    nacisnieto(kod) { // metoda pomocnicza do metody input()
        return this.nacisniety[kod]
    }

    update() {
        // niebo
        this.data.obiekty.niebo.x -= 1
        if (this.data.obiekty.niebo.x < -1440) {
            this.data.obiekty.niebo.x = 0
        }

        // mario
        this.data.obiekty.mario.obecnyStan.animacja(this.data) // animacja
        this.data.obiekty.mario.obecnyStan.ruch(this.data) // poruszanie

        // potwor
        this.data.obiekty.tabelaPotworow.forEach((p) => { // animacja
            p.obecnyStan.animacja(this.data) // w przypadku potwora i monety argument data zostal podany podczas tworzenia obiektu (w praktyce nie ma zadnej roznicy...)
        })
        this.data.obiekty.tabelaPotworow.forEach((p) => { // poruszanie
            p.obecnyStan.ruch()
        })

        // moneta
        this.data.obiekty.tabelaMonet.forEach((m) => {
            m.obecnyStan.animacja(this.data)
        })

        // bloczek monet
        this.data.obiekty.tabelaBloczkowMonet.forEach((bm) => {
            bm.obecnyStan.animacja()
            bm.moneta.obecnyStan.animacja(this.data)
            bm.obecnyStan.ruch()
        })

        // platforma
        this.data.obiekty.tabelaPlatform.forEach((p) => {
            p.obecnyStan.ruch(this.data)
        })

        // zolw
        this.data.obiekty.tabelaZolwi.forEach((z) => {
            z.obecnyStan.animacja(this.data)
            z.obecnyStan.ruch()
        })

        if (this.data.level == "level2") {
            // bloczek cegiel
            this.data.obiekty.tabelaBloczkowCegiel.forEach((bc) => {
                bc.obecnyStan.ruch()
            })

            // fragment cegiel
            this.data.obiekty.tabelaFragmentowCegiel.forEach((fc) => {
                fc.obecnyStan.ruch(this.data)
            })

            // bloczek grzybow
            this.data.obiekty.tabelaBloczkowGrzybow.forEach((bg) => {
                bg.obecnyStan.animacja()
                bg.obecnyStan.ruch()
            })

            // grzyb
            this.data.obiekty.tabelaGrzybow.forEach((g) => {
                g.obecnyStan.ruch()
            })

            // pocisk
            this.data.obiekty.tabelaPociskow.forEach((p) => {
                p.obecnyStan.animacja(this.data)
                p.obecnyStan.ruch(this.data)
            })

            // flaga
            this.data.obiekty.tabelaSlupkow.forEach((s) => {
                s.flaga.obecnyStan.ruch()
            })
        }
    }

    fizyka() {
        // zmienne pomocnicze
        var data = this.data
        var mario = data.obiekty.mario

        // smierc na skutek wypadniecia z mapy (zejscia ponizej poziomu dolnej krawedzi mapy)
        if (mario.y > 624 && !mario.momentZwyciestwa) {
            this.smierc()
        }

        // wplyw grawitacji na obiekty
        if (mario.obecnyStan != mario.stan.miganie && mario.obecnyStan != mario.stan.spuszczanie) this.grawitacja(mario)
        data.obiekty.tabelaPotworow.forEach((p) => {
            this.grawitacja(p)
        })
        data.obiekty.tabelaZolwi.forEach((z) => {
            this.grawitacja(z)
        })
        if (this.data.level == "level2") {
            data.obiekty.tabelaFragmentowCegiel.forEach((fc) => {
                this.grawitacja(fc)
            })
            data.obiekty.tabelaGrzybow.forEach((g) => {
                if (g.obecnyStan != g.stan.wyjscie) this.grawitacja(g)
            })
            data.obiekty.tabelaPociskow.forEach((p) => {
                if (p.obecnyStan != p.stan.wybuch) this.grawitacja(p)
            })
        }

        // definicja funkcji strzalkowej jako zmienna (musi byc przed jej wykorzystaniem)
        var wykrywanieKolizji = (obiekt1, obiekt2) => {
            if (obiekt1.x < obiekt2.x + obiekt2.w && obiekt1.x + obiekt1.w > obiekt2.x &&
                obiekt1.y < obiekt2.y + obiekt2.h && obiekt1.y + obiekt1.h > obiekt2.y) {
                this.kolizja(obiekt1, obiekt2, data)
            }
        }

        // wykrywanie kolizji Mario z obiektami
        if (!mario.momentSmierci && mario.obecnyStan != mario.stan.miganie) {
            data.obiekty.tabelaScian.forEach((sciana) => {
                wykrywanieKolizji(mario, sciana)
            })
            data.obiekty.tabelaMonet.forEach((moneta) => {
                wykrywanieKolizji(mario, moneta)
            })
            data.obiekty.tabelaBloczkowMonet.forEach((bloczekMonet) => {
                wykrywanieKolizji(mario, bloczekMonet)
            })
            data.obiekty.tabelaPlatform.forEach((platforma) => {
                wykrywanieKolizji(mario, platforma)
            })
            if (this.data.level == "level2") {
                data.obiekty.tabelaBloczkowCegiel.forEach((bloczekCegiel) => {
                    wykrywanieKolizji(mario, bloczekCegiel)
                })
                data.obiekty.tabelaBloczkowGrzybow.forEach((bloczekGrzybow) => {
                    wykrywanieKolizji(mario, bloczekGrzybow)
                })
                data.obiekty.tabelaBloczkowKruchych.forEach((bloczekKruchy) => {
                    wykrywanieKolizji(mario, bloczekKruchy)
                })
                data.obiekty.tabelaSlupkow.forEach((slupek) => {
                    wykrywanieKolizji(mario, slupek.flaga)
                })
            }
        }

        // wykrywanie kolizji mario z potworami oraz potworow z obiektami
        data.obiekty.tabelaPotworow.forEach((potwor) => {
            // zabezpieczenie w przypadku odniesienia zwyciestwa - Mario nie ma prawa reagowac z potworami w zaden sposob az do momentu odswiezenia przegladarki
            if (!mario.momentSmierci && !mario.momentZwyciestwa && mario.obecnyStan != mario.stan.miganie) wykrywanieKolizji(mario, potwor)

            data.obiekty.tabelaScian.forEach((sciana) => {
                wykrywanieKolizji(potwor, sciana)
            })
            data.obiekty.tabelaBloczkowMonet.forEach((bloczekMonet) => {
                wykrywanieKolizji(potwor, bloczekMonet)
            })
            data.obiekty.tabelaPlatform.forEach((platforma) => {
                wykrywanieKolizji(potwor, platforma)
            })
            data.obiekty.tabelaZolwi.forEach((zolw) => {
                wykrywanieKolizji(potwor, zolw)
            })
            if (this.data.level == "level2") {
                data.obiekty.tabelaBloczkowCegiel.forEach((bloczekCegiel) => {
                    wykrywanieKolizji(potwor, bloczekCegiel)
                })
                data.obiekty.tabelaBloczkowGrzybow.forEach((bloczekGrzybow) => {
                    wykrywanieKolizji(potwor, bloczekGrzybow)
                })
                data.obiekty.tabelaBloczkowKruchych.forEach((bloczekKruchy) => {
                    wykrywanieKolizji(potwor, bloczekKruchy)
                })
            }
        })

        // wykrywanie kolizji mario z grzybami oraz grzybow z obiektami
        if (this.data.level == "level2") {
            data.obiekty.tabelaGrzybow.forEach((grzyb) => {
                if (grzyb.obecnyStan != grzyb.stan.wyjscie) {
                    // zabezpieczenie w przypadku odniesienia zwyciestwa - Mario nie ma prawa reagowac z grzybami w zaden sposob az do momentu odswiezenia przegladarki
                    if (!mario.momentSmierci && !mario.momentZwyciestwa && mario.obecnyStan != mario.stan.miganie) wykrywanieKolizji(mario, grzyb)

                    data.obiekty.tabelaScian.forEach((sciana) => {
                        wykrywanieKolizji(grzyb, sciana)
                    })
                    data.obiekty.tabelaBloczkowMonet.forEach((bloczekMonet) => {
                        wykrywanieKolizji(grzyb, bloczekMonet)
                    })
                    data.obiekty.tabelaPlatform.forEach((platforma) => {
                        wykrywanieKolizji(grzyb, platforma)
                    })
                    data.obiekty.tabelaBloczkowCegiel.forEach((bloczekCegiel) => {
                        wykrywanieKolizji(grzyb, bloczekCegiel)
                    })
                    data.obiekty.tabelaBloczkowGrzybow.forEach((bloczekGrzybow) => {
                        wykrywanieKolizji(grzyb, bloczekGrzybow)
                    })
                    data.obiekty.tabelaZolwi.forEach((zolw) => {
                        wykrywanieKolizji(grzyb, zolw)
                    })
                    data.obiekty.tabelaBloczkowKruchych.forEach((bloczekKruchy) => {
                        wykrywanieKolizji(grzyb, bloczekKruchy)
                    })
                }
            })
        }

        // wykrywanie kolizji mario z zolwiami oraz zolwi z obiektami (w tym zolwi zywych z martwymi zolwiami)
        data.obiekty.tabelaZolwi.forEach((zolw) => {
            // zabezpieczenie w przypadku odniesienia zwyciestwa - Mario nie ma prawa reagowac z grzybami w zaden sposob az do momentu odswiezenia przegladarki
            if (!mario.momentSmierci && !mario.momentZwyciestwa && mario.obecnyStan != mario.stan.miganie) wykrywanieKolizji(mario, zolw)

            data.obiekty.tabelaScian.forEach((sciana) => {
                wykrywanieKolizji(zolw, sciana)
            })
            data.obiekty.tabelaBloczkowMonet.forEach((bloczekMonet) => {
                wykrywanieKolizji(zolw, bloczekMonet)
            })
            data.obiekty.tabelaPlatform.forEach((platforma) => {
                wykrywanieKolizji(zolw, platforma)
            })
            data.obiekty.tabelaZolwi.forEach((zolw2) => {
                if (zolw2.obecnyStan == zolw2.stan.smierc && zolw.obecnyStan != zolw.stan.smierc) wykrywanieKolizji(zolw, zolw2)
            })
            if (this.data.level == "level2") {
                data.obiekty.tabelaBloczkowCegiel.forEach((bloczekCegiel) => {
                    wykrywanieKolizji(zolw, bloczekCegiel)
                })
                data.obiekty.tabelaBloczkowGrzybow.forEach((bloczekGrzybow) => {
                    wykrywanieKolizji(zolw, bloczekGrzybow)
                })
                data.obiekty.tabelaGrzybow.forEach((grzyb) => {
                    if (grzyb.obecnyStan != grzyb.stan.wyjscie) wykrywanieKolizji(zolw, grzyb)
                })
                data.obiekty.tabelaBloczkowKruchych.forEach((bloczekKruchy) => {
                    wykrywanieKolizji(zolw, bloczekKruchy)
                })
            }
        })

        // wykrywanie kolizji pocisku z obiektami oraz mario z pociskiem
        if (this.data.level == "level2") {
            data.obiekty.tabelaPociskow.forEach((pocisk) => {
                if (!mario.momentSmierci && !mario.momentZwyciestwa && mario.obecnyStan != mario.stan.miganie && !pocisk.momentWystrzalu && pocisk.obecnyStan != pocisk.stan.wybuch) wykrywanieKolizji(mario, pocisk)
                data.obiekty.tabelaScian.forEach((sciana) => {
                    wykrywanieKolizji(pocisk, sciana)
                })
                data.obiekty.tabelaBloczkowMonet.forEach((bloczekMonet) => {
                    wykrywanieKolizji(pocisk, bloczekMonet)
                })
                data.obiekty.tabelaPlatform.forEach((platforma) => {
                    wykrywanieKolizji(pocisk, platforma)
                })
                data.obiekty.tabelaBloczkowCegiel.forEach((bloczekCegiel) => {
                    wykrywanieKolizji(pocisk, bloczekCegiel)
                })
                data.obiekty.tabelaBloczkowGrzybow.forEach((bloczekGrzybow) => {
                    wykrywanieKolizji(pocisk, bloczekGrzybow)
                })
                data.obiekty.tabelaZolwi.forEach((zolw) => {
                    wykrywanieKolizji(pocisk, zolw)
                })
                data.obiekty.tabelaBloczkowKruchych.forEach((bloczekKruchy) => {
                    wykrywanieKolizji(pocisk, bloczekKruchy)
                })
                data.obiekty.tabelaPotworow.forEach((potwor) => {
                    wykrywanieKolizji(pocisk, potwor)
                })
            })
        }
    }

    grawitacja(obiekt) { // pierwsza metoda pomocnicza do metody fizyka()
        if (obiekt.typ == "mario" && !obiekt.momentSmierci || obiekt.typ == "potwor" || obiekt.typ == "zolw" && obiekt.obecnyStan != obiekt.stan.smierc) obiekt.obecnyStan = obiekt.stan.skakanie // zabepieczenie zeby nie zmienialo obecnegoStanu innym obiektom (np. fragmentowiCegiel...)
        obiekt.pedY++
        obiekt.y += obiekt.pedY
    }

    kolizja(obiekt1, obiekt2, data) { // druga metoda pomocnicza do metody fizyka()
        var stronaKolizji = this.stronaKolizji(obiekt1, obiekt2)
        if (obiekt1.typ == "mario") {
            var mario = obiekt1
            if (obiekt2.typ == "bloczekKruchy" && mario.mozeNiszczyc) {
                data.obiekty.tabelaFragmentowCegiel.push(
                    new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 0),
                    new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 1),
                    new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 2),
                    new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 3)
                )
                var nrBloczka = data.obiekty.tabelaBloczkowKruchych.indexOf(obiekt2)
                data.obiekty.tabelaBloczkowKruchych.splice(nrBloczka, 1)
                mario.obecnyStan = mario.stan.skakanie
                if (stronaKolizji[0]) {
                    mario.pedY = -20.5
                } else if (stronaKolizji[1]) {
                    this.blokadaRuchu = true
                    mario.pedX = 8
                    mario.pedY = -10.5
                    setTimeout(() => {
                        this.blokadaRuchu = false
                    }, 250)
                } else if (stronaKolizji[2]) {
                    mario.pedY = 1
                } else if (stronaKolizji[3]) {
                    this.blokadaRuchu = true
                    mario.pedX = -8
                    mario.pedY = -10.5
                    setTimeout(() => {
                        this.blokadaRuchu = false
                    }, 250)
                }
            } else if (obiekt2.typ == "sciana" || obiekt2.typ == "bloczekMonet" || obiekt2.typ == "platforma" || obiekt2.typ == "bloczekCegiel" || obiekt2.typ == "bloczekGrzybow" || obiekt2.typ == "zolw" && obiekt2.obecnyStan == obiekt2.stan.smierc || obiekt2.typ == "bloczekKruchy") {
                if (stronaKolizji[0]) { // od góry
                    mario.obecnyStan = mario.stan.stanie
                    mario.y = obiekt2.y - mario.h
                    mario.pedY = 0
                    if (obiekt2.typ == "platforma") {
                        mario.pedX = obiekt2.pedX
                        //mario.kontrolerRuchu(data)
                        if (obiekt2.pedX > 0) mario.kontrolerRuchuNaPlatformiePrawo(data)
                        else mario.kontrolerRuchuNaPlatformieLewo(data)
                    }
                }
                if (stronaKolizji[2]) { // od dołu
                    mario.y = obiekt2.y + obiekt2.h - 1 // zeby nie przyklejal sie do bloczka
                    if (mario.pedY < 0) mario.pedY = 1
                    if (obiekt2.typ == "bloczekMonet") {
                        if (!this.wyciszenie) {
                            data.audio.moneta.volume = this.slider.value / 100.0
                            data.audio.moneta.cloneNode(true).play()
                        }
                        obiekt2.obecnyStan = obiekt2.stan.drganie
                        obiekt2.obecnyStan.licznik = 0
                        obiekt2.y = obiekt2.sy
                        obiekt2.moneta.y = obiekt2.sy
                        if (obiekt2.monety > 0) {
                            mario.monety++
                            obiekt2.monety--
                        }
                    }
                    if (obiekt2.typ == "bloczekCegiel") {
                        if (mario.mozeNiszczyc) {
                            data.obiekty.tabelaFragmentowCegiel.push(
                                new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 0),
                                new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 1),
                                new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 2),
                                new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 3)
                            )
                            var nrBloczka = data.obiekty.tabelaBloczkowCegiel.indexOf(obiekt2)
                            data.obiekty.tabelaBloczkowCegiel.splice(nrBloczka, 1)
                        } else {
                            obiekt2.obecnyStan = obiekt2.stan.drganie
                        }
                    }
                    if (obiekt2.typ == "bloczekGrzybow") {
                        obiekt2.obecnyStan = obiekt2.stan.drganie
                        if (obiekt2.pelny) {
                            data.obiekty.tabelaGrzybow.push(
                                new Grzyb(data.grafika, obiekt2.x, obiekt2.y, obiekt2.w, obiekt2.h, obiekt2.rodzaj)
                            )
                        }
                        obiekt2.pelny = false
                    }
                }
                if (stronaKolizji[3]) { // od lewej
                    mario.x = obiekt2.x - mario.w
                    mario.pedX = 0
                }
                if (stronaKolizji[1]) { // od prawej
                    mario.x = obiekt2.x + obiekt2.w
                    mario.pedX = 0
                }
            } else if (obiekt2.typ == "potwor") {
                // zderzenie z potworem z kazdej strony
                if (mario.mozeNiszczyc || mario.mozeStrzelac) {
                    mario.obecnyStan = mario.stan.miganie
                    setTimeout(() => {
                        this.smierc()
                    }, 750)
                } else {
                    mario.obecnyStan = mario.stan.smierc
                    mario.pedY = -20.5
                    mario.momentSmierci = true
                    setTimeout(() => {
                        this.smierc()
                    }, 750)
                }
            } else if (obiekt2.typ == "moneta") {
                mario.monety++
                var nrMonety = this.data.obiekty.tabelaMonet.indexOf(obiekt2)
                data.obiekty.tabelaMonet.splice(nrMonety, 1) // (numer indeksu od ktorego zaczynamy czyszczenie, liczba indeksow do usuniecia)
                if (!this.wyciszenie) {
                    //data.audio.moneta.volume = this.slider.value / 100.0
                    data.audio.moneta.cloneNode(true).play()
                }
            } else if (obiekt2.typ == "grzyb") {
                var grzyb = obiekt2
                if (grzyb.rodzaj == "zycie") {
                    var nrGrzyba = data.obiekty.tabelaGrzybow.indexOf(grzyb)
                    data.obiekty.tabelaGrzybow.splice(nrGrzyba, 1)
                    mario.zycia++
                    this.flagaZycie = true
                } else if (grzyb.rodzaj == "powiekszenie") {
                    var nrGrzyba = data.obiekty.tabelaGrzybow.indexOf(grzyb)
                    data.obiekty.tabelaGrzybow.splice(nrGrzyba, 1)
                    mario.mozeNiszczyc = true
                    this.flagaPowiekszenie = true
                } else if (grzyb.rodzaj == "strzelanie") {
                    if (mario.mozeNiszczyc) {
                        var nrGrzyba = data.obiekty.tabelaGrzybow.indexOf(grzyb)
                        data.obiekty.tabelaGrzybow.splice(nrGrzyba, 1)
                        mario.mozeStrzelac = true
                        this.flagaStrzelanie = true
                    }
                }
            } else if (obiekt2.typ == "zolw" && obiekt2.obecnyStan != obiekt2.stan.smierc) {
                if (stronaKolizji[0]) {
                    mario.obecnyStan = mario.stan.skakanie
                    mario.pedY = -20.5
                    obiekt2.obecnyStan = obiekt2.stan.smierc
                }
                if (stronaKolizji[1] || stronaKolizji[2] || stronaKolizji[3]) {
                    if (mario.mozeNiszczyc || mario.mozeStrzelac) {
                        mario.obecnyStan = mario.stan.miganie
                        setTimeout(() => {
                            this.smierc()
                        }, 750)
                    } else {
                        mario.obecnyStan = mario.stan.smierc
                        mario.pedY = -20.5
                        mario.momentSmierci = true
                        setTimeout(() => {
                            this.smierc()
                        }, 750)
                    }
                }
            } else if (obiekt2.typ == "pocisk") {
                obiekt2.obecnyStan = obiekt2.stan.wybuch
                if (mario.mozeNiszczyc || mario.mozeStrzelac) {
                    mario.obecnyStan = mario.stan.miganie
                    setTimeout(() => {
                        this.smierc()
                    }, 750)
                } else {
                    mario.obecnyStan = mario.stan.smierc
                    mario.pedY = -20.5
                    mario.momentSmierci = true
                    setTimeout(() => {
                        this.smierc()
                    }, 750)
                }
            } else if (obiekt2.typ == "flaga") {
                if (stronaKolizji[0] && obiekt2.obecnyStan == obiekt2.stan.spoczynekNaGorze) { // && mario.pedY >= 3 - gdyby nie dzialalo...
                    obiekt2.obecnyStan = obiekt2.stan.opadanie
                    mario.kierunek = "lewo"
                    mario.obecnyStan = mario.stan.spuszczanie
                    mario.x = obiekt2.x + mario.w / 4
                    mario.y = obiekt2.y - mario.h * 3 / 4
                }
                else if (obiekt2.obecnyStan == obiekt2.stan.opadanie) {
                    if (mario.kierunek == "lewo") mario.x = obiekt2.x + mario.w / 4
                    else mario.x = obiekt2.x + obiekt2.w - mario.w / 4
                    mario.y += obiekt2.pedY
                    if (obiekt2.licznikMonet < 100) { // ograniczenie do 100 monet na 1 slupek (bez niego bylo 103)
                        mario.monety += 1
                        obiekt2.licznikMonet += 1
                        if (!this.wyciszenie) {
                            //data.audio.moneta.volume = this.slider.value / 100.0
                            data.audio.moneta.cloneNode(true).play()
                        }
                    }
                    if (obiekt2.droga >= 306) {
                        mario.obecnyStan = mario.stan.stanie
                    }
                }
            }
        } else if (obiekt1.typ == "potwor") {
            var potwor = obiekt1
            if (obiekt2.typ == "sciana" || obiekt2.typ == "bloczekMonet" || obiekt2.typ == "platforma" || obiekt2.typ == "bloczekCegiel" || obiekt2.typ == "bloczekGrzybow" || obiekt2.typ == "zolw" && obiekt2.obecnyStan == obiekt2.stan.smierc || obiekt2.typ == "bloczekKruchy") {
                if (stronaKolizji[0]) { // od góry
                    potwor.obecnyStan = potwor.stan.poruszanie
                    potwor.y = obiekt2.y - potwor.h
                    potwor.pedY = 0
                    //if (obiekt2.typ == "platforma") {
                    //    if (potwor.pedX > 0) potwor.pedX = 8
                    //    else potwor.pedX = -8
                    //}
                }
                if (stronaKolizji[3]) { // od lewej
                    potwor.x = obiekt2.x - potwor.w
                    potwor.pedX = -8
                }
                if (stronaKolizji[1]) { // od prawej
                    potwor.x = obiekt2.x + obiekt2.w
                    potwor.pedX = 8
                }
            }
        } else if (obiekt1.typ == "grzyb") {
            var grzyb = obiekt1
            if (obiekt2.typ == "sciana" || obiekt2.typ == "bloczekMonet" || obiekt2.typ == "platforma" || obiekt2.typ == "bloczekCegiel" || obiekt2.typ == "bloczekGrzybow" || obiekt2.typ == "zolw" && obiekt2.obecnyStan == obiekt2.stan.smierc || obiekt2.typ == "bloczekKruchy") {
                if (stronaKolizji[0]) { // od góry
                    grzyb.obecnyStan = grzyb.stan.poruszanie
                    grzyb.y = obiekt2.y - grzyb.h
                    grzyb.pedY = 0
                    //if (obiekt2.typ == "platforma") {
                    //    if (grzyb.pedX > 0) grzyb.pedX = 2
                    //    else grzyb.pedX = - 2
                    //}
                }
                if (stronaKolizji[3]) { // od lewej
                    grzyb.x = obiekt2.x - grzyb.w
                    grzyb.pedX = -2
                }
                if (stronaKolizji[1]) { // od prawej
                    grzyb.x = obiekt2.x + obiekt2.w
                    grzyb.pedX = 2
                }
            }
        } else if (obiekt1.typ == "zolw") {
            var zolw = obiekt1
            if (obiekt2.typ == "sciana" || obiekt2.typ == "bloczekMonet" || obiekt2.typ == "platforma" || obiekt2.typ == "bloczekCegiel" || obiekt2.typ == "bloczekGrzybow" || obiekt2.typ == "zolw" || obiekt2.typ == "bloczekKruchy") {
                if (stronaKolizji[0]) { // od góry
                    if (zolw.obecnyStan != zolw.stan.smierc) zolw.obecnyStan = zolw.stan.poruszanie
                    zolw.y = obiekt2.y - zolw.h
                    zolw.pedY = 0
                    //if (obiekt2.typ == "platforma") {
                    //    if (zolw.kierunek == "prawo") zolw.pedX = 8
                    //    else zolw.pedX = -8
                    //}
                }
                if (stronaKolizji[3]) { // od lewej
                    zolw.x = obiekt2.x - zolw.w
                    zolw.pedX = -6
                }
                if (stronaKolizji[1]) { // od prawej
                    zolw.x = obiekt2.x + obiekt2.w
                    zolw.pedX = 6
                }
            }
            if (obiekt2.typ == "grzyb" && zolw.obecnyStan != zolw.stan.smierc) {
                var nrGrzyba = data.obiekty.tabelaGrzybow.indexOf(obiekt2)
                data.obiekty.tabelaGrzybow.splice(nrGrzyba, 1)
            }
        } else if (obiekt1.typ = "pocisk") {
            var pocisk = obiekt1
            if (obiekt2.typ == "sciana" || obiekt2.typ == "bloczekMonet" || obiekt2.typ == "platforma" || obiekt2.typ == "bloczekCegiel" || obiekt2.typ == "bloczekGrzybow") {
                if (stronaKolizji[1] || stronaKolizji[3]) {
                    // wyjatek dla skrajnych scian (poczatek i koniec mapy - ma sie nie odbijac)
                    if (obiekt2.typ == "sciana" && (data.obiekty.tabelaScian.indexOf(obiekt2) == 0 || data.obiekty.tabelaScian.indexOf(obiekt2) == 1)) {
                        var nrPocisku = data.obiekty.tabelaPociskow.indexOf(pocisk)
                        data.obiekty.tabelaPociskow.splice(nrPocisku, 1)
                    }
                    else {
                        //pocisk.obecnyStan = pocisk.stan.wybuch
                        pocisk.pedX = - pocisk.pedX
                        pocisk.momentWystrzalu = false // sprawia ze Mario zginie gdy pocisk odbije sie od sciany itp
                    }
                }
                else if (stronaKolizji[0]) {
                    pocisk.y = obiekt2.y - pocisk.h
                    pocisk.pedY = -10
                }
                else if (stronaKolizji[2]) {
                    pocisk.y = obiekt2.y + obiekt2.h
                    pocisk.pedY = 0
                }
            } else if (obiekt2.typ == "potwor" && pocisk.obecnyStan != pocisk.stan.wybuch) {
                pocisk.obecnyStan = pocisk.stan.wybuch
                var nrPotwora = data.obiekty.tabelaPotworow.indexOf(obiekt2)
                data.obiekty.tabelaPotworow.splice(nrPotwora, 1)
            }
            else if (obiekt2.typ == "zolw" && pocisk.obecnyStan != pocisk.stan.wybuch) {
                pocisk.obecnyStan = pocisk.stan.wybuch
                var nrZolwia = data.obiekty.tabelaZolwi.indexOf(obiekt2)
                data.obiekty.tabelaZolwi.splice(nrZolwia, 1)
            }
            else if (obiekt2.typ == "bloczekKruchy" && pocisk.obecnyStan != pocisk.stan.wybuch) {
                pocisk.obecnyStan = pocisk.stan.wybuch
                var nrBloczka = data.obiekty.tabelaBloczkowKruchych.indexOf(obiekt2)
                data.obiekty.tabelaBloczkowKruchych.splice(nrBloczka, 1)
                data.obiekty.tabelaFragmentowCegiel.push(
                    new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 0),
                    new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y, obiekt2.w / 2, obiekt2.h / 2, 1),
                    new FragmentCegiel(data.grafika, obiekt2.x, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 2),
                    new FragmentCegiel(data.grafika, obiekt2.x + obiekt2.w / 2, obiekt2.y + obiekt2.h / 2, obiekt2.w / 2, obiekt2.h / 2, 3)
                )
            }
        }
    }

    stronaKolizji(obiekt1, obiekt2) { // trzecia metoda pomocnicza do metody fizyka()
        var maksymalnaOdlegloscX = (obiekt1.w + obiekt2.w) / 2,
            maksymalnaOdlegloscY = (obiekt1.h + obiekt2.h) / 2

        var katLewyGorny = Math.atan2(maksymalnaOdlegloscY, maksymalnaOdlegloscX) * 180 / Math.PI,
            katPrawyGorny = 180 - katLewyGorny

        var odlegloscX = (obiekt2.x + obiekt2.w / 2) - (obiekt1.x + obiekt1.w / 2 - Math.sign(obiekt1.pedX) * 2), // ograniczenie wartosci pedu do 2 (-2) ze wzgledu, ze rozne obiekty maja rozne pedy, a przy pedzie 8 pojawialy sie buggi...
            odlegloscY = (obiekt2.y + obiekt2.h / 2) - (obiekt1.y + obiekt1.h / 2 - obiekt1.pedY)

        var katObiektow = Math.atan2(odlegloscY, odlegloscX) * 180 / Math.PI

        var stronaKolizji = [false, false, false, false]
        if (katObiektow > katLewyGorny && katObiektow < katPrawyGorny) {
            stronaKolizji[0] = true
        }
        if (katObiektow > katPrawyGorny || katObiektow < -katPrawyGorny) {
            stronaKolizji[1] = true
        }
        if (katObiektow > -katPrawyGorny && katObiektow < -katLewyGorny) {
            stronaKolizji[2] = true
        }
        if (katObiektow > -katLewyGorny && katObiektow < katLewyGorny) {
            stronaKolizji[3] = true
        }

        return stronaKolizji
    }

    render() {
        // niebo
        this.rysuj(this.data.obiekty.niebo, this.data.ctx.sky)

        // mapa
        this.data.ctx.bg.clearRect(0, 0, this.data.canvas.bg.width, this.data.canvas.bg.height)
        this.rysuj(this.data.obiekty.mapa, this.data.ctx.bg)

        // czyszczenie foregroundu
        this.data.ctx.fg.clearRect(0, 0, this.data.canvas.fg.width, this.data.canvas.fg.height)

        // slupki i flagi
        if (this.data.level == "level2") {
            this.data.obiekty.tabelaSlupkow.forEach((s) => {
                this.rysuj(s, this.data.ctx.fg)
                this.rysuj(s.flaga, this.data.ctx.fg)
            })
        }

        // mario
        this.rysuj(this.data.obiekty.mario, this.data.ctx.fg)

        // potwory
        this.data.obiekty.tabelaPotworow.forEach((p) => {
            this.rysuj(p, this.data.ctx.fg)
        })

        // bloczki monet
        this.data.obiekty.tabelaBloczkowMonet.forEach((bm) => {
            if (bm.monety > 0) this.rysuj(bm.moneta, this.data.ctx.fg)
            this.rysuj(bm, this.data.ctx.fg)
        })

        // platformy
        this.data.obiekty.tabelaPlatform.forEach((p) => {
            this.rysuj(p, this.data.ctx.fg)
        })

        // zolwie
        this.data.obiekty.tabelaZolwi.forEach((z) => {
            this.rysuj(z, this.data.ctx.fg)
        })

        if (this.data.level == "level2") {
            // bloczki cegiel
            this.data.obiekty.tabelaBloczkowCegiel.forEach((bc) => {
                this.rysuj(bc, this.data.ctx.fg)
            })

            // grzyby
            this.data.obiekty.tabelaGrzybow.forEach((g) => {
                this.rysuj(g, this.data.ctx.fg)
            })

            // bloczki grzybow
            this.data.obiekty.tabelaBloczkowGrzybow.forEach((bg) => {
                this.rysuj(bg, this.data.ctx.fg)
            })

            // bloczki kruche
            this.data.obiekty.tabelaBloczkowKruchych.forEach((bk) => {
                this.rysuj(bk, this.data.ctx.fg)
            })

            // fragmenty cegiel
            this.data.obiekty.tabelaFragmentowCegiel.forEach((fc) => {
                this.rysuj(fc, this.data.ctx.fg)
            })

            // pociski
            this.data.obiekty.tabelaPociskow.forEach((p) => {
                this.rysuj(p, this.data.ctx.fg)
            })
        }

        // monety
        this.data.obiekty.tabelaMonet.forEach((m) => {
            this.rysuj(m, this.data.ctx.fg)
        })

        // WSZYSTKO PONIZEJ MUSI POZOSTAC NA SAMYM KONCU !!! NOWE OBIEKTY DODAWAC POWYZEJ !!!
        // napis z zyciami
        this.pisz("Lives: " + this.data.obiekty.mario.zycia, this.data.ctx.fg, 16, 32, '32px', 'PixelEmulator')

        // napis z punktami
        if (this.data.level == "level1") {
            if (this.data.obiekty.mario.monety < 10)
                this.pisz("Score: " + this.data.obiekty.mario.monety + "/30", this.data.ctx.fg, 650, 32, '32px', 'PixelEmulator')
            else this.pisz("Score: " + this.data.obiekty.mario.monety + "/30", this.data.ctx.fg, 630, 32, '32px', 'PixelEmulator')
        } else {
            if (this.data.obiekty.mario.monety < 10)
                this.pisz("Score: " + this.data.obiekty.mario.monety + "/270", this.data.ctx.fg, 630, 32, '32px', 'PixelEmulator')
            else if (this.data.obiekty.mario.monety < 100) this.pisz("Score: " + this.data.obiekty.mario.monety + "/270", this.data.ctx.fg, 610, 32, '32px', 'PixelEmulator')
            else this.pisz("Score: " + this.data.obiekty.mario.monety + "/270", this.data.ctx.fg, 580, 32, '32px', 'PixelEmulator')
        }

        // napis game over
        if (this.data.obiekty.mario.zycia == 0) {
            this.pisz("Game over", this.data.ctx.fg, 200, 300, '72px', 'PixelEmulator')
            this.pisz("Score: " + this.data.obiekty.mario.monety, this.data.ctx.fg, 235, 400, '72px', 'PixelEmulator')
        }

        // napis you win - warunek wygranej
        if (this.data.obiekty.mario.monety >= 30 && this.data.level == "level1" || this.data.obiekty.mario.monety >= 270 && this.data.level == "level2") {
            this.pisz("You win", this.data.ctx.fg, 300, 300, '72px', 'PixelEmulator')
            this.pisz("Score: " + this.data.obiekty.mario.monety, this.data.ctx.fg, 265, 400, '72px', 'PixelEmulator')
            this.data.obiekty.mario.momentZwyciestwa = true
            if (this.flaga) { // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz
                this.flaga = false
                setTimeout(() => {
                    if (this.data.level == "level1") {
                        this.data = this.level2
                        if (this.wyciszenie) this.data.obiekty.mario.wyciszenie = true
                        else this.data.obiekty.mario.wyciszenie = false
                    } else location.reload()
                    this.flaga = true
                    this.flaga2 = true
                }, 4000)
            }
        }

        // napis z informacja o levelu
        if (this.flaga2) {  // flaga potrzebna aby if wykonywal sie w kazdej klatce przez okreslony czas
            if (this.data.level == "level1") this.pisz("Level 1", this.data.ctx.fg, 350, 300, '56px', 'PixelEmulator')
            else this.pisz("Level 2", this.data.ctx.fg, 350, 300, '56px', 'PixelEmulator')

            if (this.flaga3) { // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz
                this.flaga3 = false
                setTimeout(() => {
                    this.flaga2 = false
                    this.flaga3 = true
                }, 4000)
            }
        }

        // napisy z informacja o grzybach
        if (this.flagaZycie) {  // flaga potrzebna aby if wykonywal sie w kazdej klatce przez okreslony czas
            this.pisz("You have collected", this.data.ctx.fg, 90, 300, '56px', 'PixelEmulator')
            this.pisz("an extra life", this.data.ctx.fg, 230, 400, '56px', 'PixelEmulator')

            if (this.flaga3) { // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz
                this.flaga3 = false
                setTimeout(() => {
                    this.flagaZycie = false
                    this.flaga3 = true
                }, 4000)
            }
        }
        if (this.flagaPowiekszenie) {  // flaga potrzebna aby if wykonywal sie w kazdej klatce przez okreslony czas
            this.pisz("Maybe you could", this.data.ctx.fg, 150, 300, '56px', 'PixelEmulator')
            this.pisz("destroy something...", this.data.ctx.fg, 100, 400, '56px', 'PixelEmulator')

            if (this.flaga3) { // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz
                this.flaga3 = false
                setTimeout(() => {
                    this.flagaPowiekszenie = false
                    this.flaga3 = true
                }, 4000)
            }
        }
        if (this.flagaStrzelanie) {  // flaga potrzebna aby if wykonywal sie w kazdej klatce przez okreslony czas
            this.pisz("And what if you", this.data.ctx.fg, 150, 300, '56px', 'PixelEmulator')
            this.pisz("press CTRL ???", this.data.ctx.fg, 180, 400, '56px', 'PixelEmulator')

            if (this.flaga3) { // konieczna flaga aby zawartosc if'a wykonala sie tylko 1 raz
                this.flaga3 = false
                setTimeout(() => {
                    this.flagaStrzelanie = false
                    this.flaga3 = true
                }, 4000)
            }
        }
    }

    rysuj(co, gdzie) { // pierwsza pomocnicza metoda do metody render()
        gdzie.drawImage(co.obraz.img, co.obraz.x, co.obraz.y, co.obraz.w, co.obraz.h,
            co.x, co.y, co.w, co.h)
    }

    pisz(tekst, gdzie, x, y, rozmiar, czcionka) { // druga pomocnicza metoda do metody render()
        gdzie.font = rozmiar + ' ' + czcionka
        gdzie.fillStyle = 'darkslategrey' // kolor czcionki
        gdzie.fillText(tekst, x, y) // x, y - wspolrzedne od ktorych metoda ma zaczac pisac tekst
    }

    smierc() { // metoda wywolywana przez metode fizyka()
        var mario = this.data.obiekty.mario

        if (mario.zycia > 0) {
            mario.zycia--
        }

        if (mario.zycia == 0) {
            setTimeout(() => {
                location.reload() // odswiezenie okna przegladarki
            }, 4000)
        } else {
            // reset pozycji scian
            for (var i = 0; i < this.data.obiekty.tabelaScian.length; i++) {
                this.data.obiekty.tabelaScian[i].x -= this.data.obiekty.mapa.x
            }
            // reset pozycji potworow
            for (var i = 0; i < this.data.obiekty.tabelaPotworow.length; i++) {
                this.data.obiekty.tabelaPotworow[i].x -= this.data.obiekty.mapa.x
            }
            // reset pozycji monet
            for (var i = 0; i < this.data.obiekty.tabelaMonet.length; i++) {
                this.data.obiekty.tabelaMonet[i].x -= this.data.obiekty.mapa.x
            }
            // reset pozycji bloczkow monet
            for (var i = 0; i < this.data.obiekty.tabelaBloczkowMonet.length; i++) {
                this.data.obiekty.tabelaBloczkowMonet[i].x -= this.data.obiekty.mapa.x
                this.data.obiekty.tabelaBloczkowMonet[i].moneta.x -= this.data.obiekty.mapa.x
            }
            // reset pozycji platform
            for (var i = 0; i < this.data.obiekty.tabelaPlatform.length; i++) {
                this.data.obiekty.tabelaPlatform[i].x -= this.data.obiekty.mapa.x
            }
            // reset pozycji zolwi
            for (var i = 0; i < this.data.obiekty.tabelaZolwi.length; i++) {
                this.data.obiekty.tabelaZolwi[i].x -= this.data.obiekty.mapa.x
            }
            if (this.data.level == "level2") {
                // reset pozycji bloczkow cegiel
                for (var i = 0; i < this.data.obiekty.tabelaBloczkowCegiel.length; i++) {
                    this.data.obiekty.tabelaBloczkowCegiel[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji fragmentow cegiel
                for (var i = 0; i < this.data.obiekty.tabelaFragmentowCegiel.length; i++) {
                    this.data.obiekty.tabelaFragmentowCegiel[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji bloczkow grzybow
                for (var i = 0; i < this.data.obiekty.tabelaBloczkowGrzybow.length; i++) {
                    this.data.obiekty.tabelaBloczkowGrzybow[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji grzybow
                for (var i = 0; i < this.data.obiekty.tabelaGrzybow.length; i++) {
                    this.data.obiekty.tabelaGrzybow[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji bloczkow kruchych
                for (var i = 0; i < this.data.obiekty.tabelaBloczkowKruchych.length; i++) {
                    this.data.obiekty.tabelaBloczkowKruchych[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji pociskow
                for (var i = 0; i < this.data.obiekty.tabelaPociskow.length; i++) {
                    this.data.obiekty.tabelaPociskow[i].x -= this.data.obiekty.mapa.x
                }
                // reset pozycji slupkow
                for (var i = 0; i < this.data.obiekty.tabelaSlupkow.length; i++) {
                    this.data.obiekty.tabelaSlupkow[i].x -= this.data.obiekty.mapa.x
                    this.data.obiekty.tabelaSlupkow[i].flaga.x -= this.data.obiekty.mapa.x
                }
            }

            // reset mapy i postaci na jej poczatek
            this.data.obiekty.mapa.x = 0
            mario.x = 528
            mario.y = 0
            mario.kierunek = "prawo"
            mario.pedY = 1
            mario.obecnyStan = mario.stan.stanie // w stanie smierci (kontakt z potworem) pedX jest zerowany wiec musi zostac zmieniony na jakis bez zerowania pedu np na domyslny (poczatkowy)
            //mario.pedX = 8 // w przypadku smierci spowodowanej kontaktem z potworem pedX jest zerowany wiec musi zostac przywrocony
            mario.momentSmierci = false
        }
    }

    prepare() { // metoda przygotowujaca dane do glownego zbiornika wyjsciowego
        var canvas = {
            sky: document.getElementById("sky-canvas"),
            bg: document.getElementById("bg-canvas"),
            fg: document.getElementById("fg-canvas")
        }

        var ctx = {
            sky: canvas.sky.getContext("2d"),
            bg: canvas.bg.getContext("2d"),
            fg: canvas.fg.getContext("2d")
        }

        var grafikaLevel1 = new Image()
        grafikaLevel1.src = "img/stylesheet.png"

        var grafikaLevel2 = new Image()
        grafikaLevel2.src = "img/stylesheet2.png"

        // tablica tablic ze scianami (wymiary 3x na plotnie)
        var sciany = [[0, 528, 1104, 96], [528, 336, 144, 48], [576, 144, 48, 48], [960, 480, 144, 48], [1008, 432, 96, 48],
        [1056, 384, 48, 48], [1296, 528, 480, 96], [1296, 480, 144, 48], [1296, 432, 96, 48], [1296, 384, 48, 48],
        [1776, 480, 48, 144], [1920, 432, 48, 192], [2064, 384, 48, 240], [2208, 336, 48, 288], [2352, 336, 528, 96],
        [2352, 432, 384, 96], [2352, 528, 1968, 96], [2256, 96, 144, 48], [2544, 96, 48, 48], [2736, 96, 48, 48],
        [2928, 96, 48, 48], [3120, 144, 48, 48], [3024, 336, 48, 48], [3216, 336, 48, 48], [3504, 480, 288, 48],
        [3552, 432, 240, 48], [3600, 384, 192, 48], [3648, 336, 144, 48], [3696, 288, 96, 48], [3744, 240, 48, 48],
        [-48, 0, 48, 624], [4320, -384, 48, 1008]] // dwie ostatnie to krawedzie mapy z lewej i prawej strony

        // rozmieszczenie potworow na plotnie (jak rowniez regulacja ich ilosci - im dluzsza tablica tym wiecej potworow)
        var potwory = [[912, 480], [816, 480], [720, 480], [624, 480], [528, 480], [432, 480],
        [1488, 480],
        [2880, 480], [2976, 480], //[3072, 480], [3168, 480],
        [3904, 480], [4000, 480]]

        // rozmieszczenie monet na plotnie
        var monety = [[160, 80], [300, 60], [576, 389], [942, 20],
        [1298, 20], [1580, 475], [1840, 5], [1940, 5], [2040, 5], [2140, 5], [2300, 149],
        [2784, 475], [3120, 197], [3025, 389], [3215, 389], [3300, 5], [3400, 197],
        [3840, 475], [4224, 475], [4200, 70]]

        // rozmieszczenie bloczkow monet
        var bloczkiMonet = [[4000, 70]]

        // rozmieszczenie platform
        var platformy = [[1580, 180, { min: 1580, max: 2156 }], [3800, 350, { min: 3800, max: 4320 }]]

        // rozmieszczenie zolwi
        var zolwie = [[3264, 480], [3360, 480]]

        // kontener wyjsciowy
        var dane = {
            nrKlatki: 0,
            canvas: canvas,
            ctx: ctx,
            grafika: grafikaLevel2,
            audio: {
                skok: new Audio("audio/jump_melody.mp3"),
                moneta: new Audio("audio/coin_melody.mp3")
            },
            level: "level1"
        }

        var niebo = {
            obraz: new Obraz(grafikaLevel1, 0, 208, 960, 208),
            x: 0,
            y: 0,
            w: 2880,
            h: 624
        }

        var mapa = {
            obraz: new Obraz(grafikaLevel1, 0, 0, 1440, 208),
            x: 0,
            y: 0,
            w: 4320,
            h: 624
        }

        var mario = new Mario(dane.grafika, 528, 0, 48, 48) // nasz Mario zostanie rozciagniety 3-krotnie

        dane.obiekty = {} // dodanie nowego podkontenera w kontenerze dane
        dane.obiekty.niebo = niebo
        dane.obiekty.mapa = mapa
        dane.obiekty.mario = mario
        dane.obiekty.tabelaScian = []
        dane.obiekty.tabelaPotworow = []
        dane.obiekty.tabelaMonet = []
        dane.obiekty.tabelaBloczkowMonet = []
        dane.obiekty.tabelaPlatform = []
        dane.obiekty.tabelaZolwi = []

        sciany.forEach((z) => {
            dane.obiekty.tabelaScian.push(new Sciana(z[0], z[1], z[2], z[3]))
        })

        potwory.forEach((p) => {
            dane.obiekty.tabelaPotworow.push(new Potwor(dane.grafika, p[0], p[1], 48, 48))
        })

        monety.forEach((m) => {
            dane.obiekty.tabelaMonet.push(new Moneta(dane.grafika, m[0], m[1], 48, 48))
        })

        bloczkiMonet.forEach((bm) => {
            dane.obiekty.tabelaBloczkowMonet.push(new BloczekMonet(dane.grafika, bm[0], bm[1], 48, 48))
        })

        platformy.forEach((p) => {
            dane.obiekty.tabelaPlatform.push(new Platforma(dane.grafika, p[0], p[1], 144, 24, p[2]))
        })

        zolwie.forEach((z) => {
            dane.obiekty.tabelaZolwi.push(new Zolw(dane.grafika, z[0], z[1], 60, 64)) // 60x64
        })

        return dane // eksport wszystkich danych (zmiennych i obiektow) do konstuktora
    }

    prepare2() { // metoda przygotowujaca dane do glownego zbiornika wyjsciowego
        var canvas = {
            sky: document.getElementById("sky-canvas"),
            bg: document.getElementById("bg-canvas"),
            fg: document.getElementById("fg-canvas")
        }

        var ctx = {
            sky: canvas.sky.getContext("2d"),
            bg: canvas.bg.getContext("2d"),
            fg: canvas.fg.getContext("2d")
        }

        var grafika = new Image()
        grafika.src = "img/stylesheet2.png"

        // tablica tablic ze scianami (wymiary 3x na plotnie)
        var sciany = [[-48, -192, 48, 816], [7344, -192, 48, 816], [0, 528, 1056, 96], [960, 480, 48, 48], [1008, 432, 48, 96],
        [1056, 384, 48, 240], [1344, 528, 432, 96], [1296, 384, 48, 240], [1344, 432, 48, 96], [1392, 480, 48, 48],
        [2352, 528, 524, 96],
        [3792, 384, 524, 96], [3792, 576, 524, 48],
        [4800, 240, 96, 384], [4896, 576, 1008, 48], [4992, 384, 672, 96], [5664, 240, 96, 240],
        [6432, 528, 384, 96],
        [7056, 528, 288, 96],
        [432, -336, 48, 336]]

        // rozmieszczenie potworow na plotnie (jak rowniez regulacja ich ilosci - im dluzsza tablica tym wiecej potworow)
        var potwory = [[384, 132], [432, 480], [528, 480], [624, 480], [720, 480], [816, 480], [912, 480],
        [1488, 480], [1584, 480], [1680, 480], [2688, 480], [4080, 480],
        [5040, 336], [5136, 336], [5232, 336],
        [4992, 528], [5088, 528], [5184, 528], [5280, 528], [5376, 528], [5472, 528],
        [7008, 480], [7104, 480], [7200, 480]]

        // rozmieszczenie monet na plotnie
        var monety = [[48, 48], [144, 48], [240, 48], [336, 48], [48, 475], [480, 475], [864, 475],
        [1776, 427], [1920, 379], [2064, 331], [2208, 283], [2064, 523], [2208, 475],
        [2976, 336], [3024, 336], [3072, 336], [3264, 288], [3312, 288], [3360, 288], [3552, 240], [3600, 240], [3648, 240],
        [3888, 523], [4032, 523], [4176, 523],
        [4512, 5], [4512, 149], [4512, 437],
        [5136, 228], [5568, 331],
        [4944, 523], [5136, 523], [5328, 523], [5520, 523], [5712, 523],
        [5904, 427], [6144, 331], [6384, 379], [7200, 475], [7296, 475]]

        // rozmieszczenie bloczkow monet
        var bloczkiMonet = [[528, 192], [1584, 336], [4032, 192]]

        // rozmieszczenie platform
        var platformy = [[0, 384, { min: 0, max: 672 }],
        [4320, 576, { min: 4320, max: 4800 }], [4800, 384, { min: 4320, max: 4800 }],
        [6624, 384, { min: 6624, max: 7152 }]]

        // rozmieszczenie bloczkow cegiel
        var bloczkiCegiel = [[0, 192], [48, 192], [96, 192], [144, 192], [192, 192], [240, 192], [288, 192], [336, 192], [384, 192], [432, 192],
        [432, 144], [432, 144], [432, 96], [432, 48], [432, 0], [480, 192], [576, 192], [1536, 336], [1632, 336], [2544, 336], [2640, 336],
        [2352, 480], [2832, 480], [3792, 336], [3792, 480], [3792, 528], [4272, 336], [3984, 192], [4080, 192],
        [5328, 192], [5424, 192], [7104, 144], [7200, 144]]

        // rozmieszczenie bloczkow grzybow
        var bloczkiGrzybow = [[2592, 336, "zycie"], [5376, 192, "powiekszenie"], [7152, 144, "strzelanie"]]

        // rozmieszczenie zolwi
        var zolwie = [[0, 132], [336, 480], [2784, 480], [3888, 336], [4176, 336], [3888, 480], [4176, 480],
        [5280, 528], [5376, 528], [5472, 528]]

        // rozmieszczenie bloczkow kruchych
        var bloczkiKruche = [[1776, 480], [1776, 528], [1776, 576], [1920, 432], [1920, 480], [1920, 528], [1920, 576],
        [2064, 384], [2064, 432], [2064, 480], [2064, 528], [2064, 576],
        [2208, 336], [2208, 384], [2208, 432], [2208, 480], [2208, 528], [2208, 576],
        [2976, 528], [3024, 528], [3072, 528], [3264, 480], [3312, 480], [3360, 480], [3552, 432], [3600, 432], [3648, 432],
        [5712, -144], [5712, -96], [5712, -48], [5712, 0], [5712, 48], [5712, 96], [5712, 144], [5712, 192],
        [5904, 528], [5904, 576], [6144, 432], [6144, 480], [6144, 528], [6144, 576], [6384, 480], [6384, 528], [6384, 576],
        [4272, 480], [4272, 528], [4992, 336], [6816, 528], [6864, 528], [6912, 528], [6960, 528], [7008, 528]]

        // rozmieszczenie slupkow
        var slupki = [[768, 96], [6480, 96]]

        // kontener wyjsciowy
        var dane = {
            nrKlatki: 0,
            canvas: canvas,
            ctx: ctx,
            grafika: grafika,
            audio: {
                skok: new Audio("audio/jump_melody.mp3"),
                moneta: new Audio("audio/coin_melody.mp3")
            },
            level: "level2"
        }

        var niebo = {
            obraz: new Obraz(dane.grafika, 2448, 0, 960, 208),
            x: 0,
            y: 0,
            w: 2880,
            h: 624
        }

        var mapa = {
            obraz: new Obraz(dane.grafika, 0, 0, 2448, 208),
            x: 0,
            y: 0,
            w: 7344,
            h: 624
        }

        var mario = new Mario(dane.grafika, 528, 0, 48, 48) // pozycja startowa x,y Mario (zostanie rozciagniety 3-krotnie stad 48x48)

        dane.obiekty = {} // dodanie nowego podkontenera w kontenerze dane
        dane.obiekty.niebo = niebo
        dane.obiekty.mapa = mapa
        dane.obiekty.mario = mario
        dane.obiekty.tabelaScian = []
        dane.obiekty.tabelaPotworow = []
        dane.obiekty.tabelaMonet = []
        dane.obiekty.tabelaBloczkowMonet = []
        dane.obiekty.tabelaPlatform = []
        dane.obiekty.tabelaBloczkowCegiel = []
        dane.obiekty.tabelaFragmentowCegiel = []
        dane.obiekty.tabelaBloczkowGrzybow = []
        dane.obiekty.tabelaGrzybow = []
        dane.obiekty.tabelaZolwi = []
        dane.obiekty.tabelaBloczkowKruchych = []
        dane.obiekty.tabelaPociskow = []
        dane.obiekty.tabelaSlupkow = []

        sciany.forEach((z) => {
            dane.obiekty.tabelaScian.push(new Sciana(z[0], z[1], z[2], z[3]))
        })

        potwory.forEach((p) => {
            dane.obiekty.tabelaPotworow.push(new Potwor(dane.grafika, p[0], p[1], 48, 48))
        })

        monety.forEach((m) => {
            dane.obiekty.tabelaMonet.push(new Moneta(dane.grafika, m[0], m[1], 48, 48))
        })

        bloczkiMonet.forEach((bm) => {
            dane.obiekty.tabelaBloczkowMonet.push(new BloczekMonet(dane.grafika, bm[0], bm[1], 48, 48))
        })

        platformy.forEach((p) => {
            dane.obiekty.tabelaPlatform.push(new Platforma(dane.grafika, p[0], p[1], 144, 24, p[2]))
        })

        bloczkiCegiel.forEach((bc) => {
            dane.obiekty.tabelaBloczkowCegiel.push(new BloczekCegiel(dane.grafika, bc[0], bc[1], 48, 48))
        })

        bloczkiGrzybow.forEach((bg) => {
            dane.obiekty.tabelaBloczkowGrzybow.push(new BloczekGrzybow(dane.grafika, bg[0], bg[1], 48, 48, bg[2]))
        })

        zolwie.forEach((z) => {
            dane.obiekty.tabelaZolwi.push(new Zolw(dane.grafika, z[0], z[1], 60, 64)) // 60x64
        })

        bloczkiKruche.forEach((bk) => {
            dane.obiekty.tabelaBloczkowKruchych.push(new BloczekKruchy(dane.grafika, bk[0], bk[1], 48, 48))
        })

        slupki.forEach((s) => {
            dane.obiekty.tabelaSlupkow.push(new Slupek(dane.grafika, s[0], s[1], 48, 432))
            dane.obiekty.tabelaScian.push(new Sciana(s[0], s[1] + 384, 48, 48))
        })

        return dane // eksport wszystkich danych (zmiennych i obiektow) do konstuktora
    }

    changeToLevel1() {
        this.data = this.prepare()
        this.flaga2 = true
        if (this.wyciszenie) this.data.obiekty.mario.wyciszenie = true
        else this.data.obiekty.mario.wyciszenie = false
    }

    changeToLevel2() {
        this.data = this.prepare2()
        this.flaga2 = true
        if (this.wyciszenie) this.data.obiekty.mario.wyciszenie = true
        else this.data.obiekty.mario.wyciszenie = false
    }

    switchMute() {
        this.melodia.loop = true // albo ta linijka zadziala z inputa na podstawie interakcji albo z onclicka w buttonie MUTE
        this.interakcja = true
        if (this.wyciszenie) {
            this.wyciszenie = false
            this.data.obiekty.mario.wyciszenie = false
            this.melodia.play()
        } else {
            this.wyciszenie = true
            this.data.obiekty.mario.wyciszenie = true
            this.melodia.pause()
        }
    }

    changeVolume() {
        // update poziomu glosnosci przeskalowany na 0-1
        this.melodia.volume = this.slider.value / 100.0
        this.data.audio.skok.volume = this.slider.value / 100.0
        this.data.audio.moneta.volume = this.slider.value / 100.0
        // update monet, bloczkow monet i flag jest niemozliwy do wykonania ze wzgledu na clodeNode ktory koliduje jakos volume...
    }
}