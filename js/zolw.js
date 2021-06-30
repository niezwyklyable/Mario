
class Zolw {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3456, 136, 16, 24)

        this.animacja = {
            poruszaniePrawo: {
                klatka: [new Obraz(img, 3456, 136, 16, 24),
                new Obraz(img, 3472, 136, 16, 24)],
                obecnaKlatka: 0
            },
            poruszanieLewo: {
                klatka: [new Obraz(img, 3488, 136, 16, 24),
                new Obraz(img, 3504, 136, 16, 24)],
                obecnaKlatka: 0
            },
            martwyLewo: new Obraz(img, 3472, 112, 16, 16),
            martwyPrawo: new Obraz(img, 3488, 112, 16, 16)
        }

        this.stan = {
            poruszanie: {
                ruch: () => {
                    this.x += this.pedX
                },
                animacja: (data) => {
                    if (this.pedX > 0) {
                        this.kierunek = "prawo"
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = this.animacja.poruszaniePrawo.klatka[this.animacja.poruszaniePrawo.obecnaKlatka]
                            this.animacja.poruszaniePrawo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (this.animacja.poruszaniePrawo.obecnaKlatka > 1) {
                            this.animacja.poruszaniePrawo.obecnaKlatka = 0
                        }
                    } else if (this.pedX < 0) { // w lewo
                        this.kierunek = "lewo"
                        if (data.nrKlatki % 5 == 0) { // co piata klatka
                            this.obraz = this.animacja.poruszanieLewo.klatka[this.animacja.poruszanieLewo.obecnaKlatka]
                            this.animacja.poruszanieLewo.obecnaKlatka++
                        }
                        // zabezpieczenie klatki
                        if (this.animacja.poruszanieLewo.obecnaKlatka > 1) {
                            this.animacja.poruszanieLewo.obecnaKlatka = 0
                        }
                    }
                }
            },
            smierc: {
                ruch: () => {
                    this.pedX = 0
                },
                animacja: () => {
                    this.w = w - 12
                    this.h = h - 16
                    if (this.kierunek = "prawo") this.obraz = this.animacja.martwyPrawo
                    else this.obraz = this.animacja.martwyLewo
                }
            },
            skakanie: {
                ruch: () => {
                    return
                },
                animacja: () => {
                    if(this.kierunek == "prawo") this.obraz = new Obraz(img, 3456, 136, 16, 24)
                    else this.obraz = new Obraz(img, 3488, 136, 16, 24)
                }
            }
        }

        this.obecnyStan = this.stan.poruszanie
        this.pedY = 0
        this.pedX = 6
        this.kierunek = "prawo"
        this.typ = "zolw"
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}