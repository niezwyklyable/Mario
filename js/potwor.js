
class Potwor {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3408, 96, 16, 16)
        this.animacja = {
            poruszanie: {
                klatka: [new Obraz(img, 3408, 96, 16, 16),
                new Obraz(img, 3424, 96, 16, 16),
                new Obraz(img, 3440, 96, 16, 16),
                new Obraz(img, 3456, 96, 16, 16)],
                obecnaKlatka: 0
            },
            skok: new Obraz(img, 3408, 96, 16, 16)
        }

        this.stan = {

            poruszanie: {

                ruch: () => {
                   // if (this.kierunek == "prawo") {
                        this.x += this.pedX
                   // } else {
                   //     this.x -= this.pedX
                   // }
                },

                animacja: (data) => {
                    if (data.nrKlatki % 5 == 0) {
                        this.obraz = this.animacja.poruszanie.klatka[this.animacja.poruszanie.obecnaKlatka]
                        this.animacja.poruszanie.obecnaKlatka++
                    }

                    if (this.animacja.poruszanie.obecnaKlatka > 3) {
                        this.animacja.poruszanie.obecnaKlatka = 0
                    }
                }
            },

            skakanie: {
                ruch: () => {
                    return
                },
                animacja: () => {
                    this.obraz = this.animacja.skok
                }
            }
        }

        this.obecnyStan = this.stan.poruszanie
        //this.kierunek = "prawo"
        this.pedY = 0
        this.pedX = 8
        this.typ = "potwor"
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}