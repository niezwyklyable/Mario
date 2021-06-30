
class Pocisk {
    constructor(img, x, y, w, h, p) {
        this.obraz = new Obraz(img, 3408, 176, 8, 8)

        this.animacja = {
            obrot: {
                klatka: [new Obraz(img, 3408, 176, 8, 7.5),
                new Obraz(img, 3416, 176, 8, 7.5),
                new Obraz(img, 3408, 184, 8, 7.5),
                new Obraz(img, 3416, 184, 8, 7.5)],
                obecnaKlatka: 0
            },
            wybuch: {
                klatka: [new Obraz(img, 3424, 176, 16, 15),
                new Obraz(img, 3440, 176, 16, 15),
                new Obraz(img, 3456, 184, 16, 15),
                new Obraz(img, 3472, 184, 16, 15)],
                obecnaKlatka: 0
            }
        }

        this.stan = {
            obrot: {
                ruch: (data) => {
                    this.x += this.pedX
                    if (this.y > data.obiekty.mapa.h) {
                        let nrPocisku = data.obiekty.tabelaPociskow.indexOf(this)
                        data.obiekty.tabelaPociskow.splice(nrPocisku, 1)
                    }
                },
                animacja: (data) => {
                    if (data.nrKlatki % 5 == 0) {
                        this.obraz = this.animacja.obrot.klatka[this.animacja.obrot.obecnaKlatka]
                        this.animacja.obrot.obecnaKlatka++
                    }

                    if (this.animacja.obrot.obecnaKlatka > 3) {
                        this.animacja.obrot.obecnaKlatka = 0
                    }
                }
            },
            wybuch: {
                ruch: (data) => { },
                animacja: (data) => {
                    this.w = 2 * w
                    this.h = 2 * h
                    if (data.nrKlatki % 5 == 0) {
                        this.obraz = this.animacja.wybuch.klatka[this.animacja.wybuch.obecnaKlatka]
                        this.animacja.wybuch.obecnaKlatka++
                    }

                    if (this.animacja.wybuch.obecnaKlatka > 3) {
                        let nrPocisku = data.obiekty.tabelaPociskow.indexOf(this)
                        data.obiekty.tabelaPociskow.splice(nrPocisku, 1)
                    }
                }
            }
        }

        this.obecnyStan = this.stan.obrot
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pedX = p
        this.pedY = -10
        this.momentWystrzalu = true
        this.typ = "pocisk"
    }
}