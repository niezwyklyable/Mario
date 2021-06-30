
class Moneta {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3408, 112, 16, 16)

        this.animacja = {
            obrot: {
                klatka: [new Obraz(img, 3408, 112, 16, 16),
                new Obraz(img, 3424, 112, 16, 16),
                new Obraz(img, 3440, 112, 16, 16),
                new Obraz(img, 3456, 112, 16, 16)],
                obecnaKlatka: 0
            }
        }

        this.stan = {
            obrot: {
                animacja: (data) => {
                    if (data.nrKlatki % 5 == 0) {
                        this.obraz = this.animacja.obrot.klatka[this.animacja.obrot.obecnaKlatka]
                        this.animacja.obrot.obecnaKlatka++
                    }

                    if (this.animacja.obrot.obecnaKlatka > 3) {
                        this.animacja.obrot.obecnaKlatka = 0
                    }
                }
            }
        }

        this.obecnyStan = this.stan.obrot
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.typ = "moneta"
    }
}