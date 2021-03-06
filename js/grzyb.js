
class Grzyb {
    constructor(img, x, y, w, h, r) {
        if (r == "zycie") {
            this.obraz = new Obraz(img, 3424, 144, 16, 16)
            this.pedX = 2
        } else if (r == "powiekszenie") {
            this.obraz = new Obraz(img, 3408, 144, 16, 16)
            this.pedX = 2
        } else if (r == "strzelanie") {
            this.obraz = new Obraz(img, 3440, 144, 16, 16)
            this.pedX = 0
        }

        this.stan = {
            poruszanie: {
                ruch: (data) => {
                    this.x += this.pedX
                }
            },
            wyjscie: {
                licznik: 0,
                ruch: (data) => {
                    this.obecnyStan.licznik++
                    if (this.obecnyStan.licznik < 5) {
                        this.pedY -= 2
                        this.y += this.pedY
                    } else if (this.obecnyStan.licznik < 8) {
                        this.y += this.pedY
                    } else {
                        this.obecnyStan = this.stan.poruszanie
                    }
                }
            }
        }

        this.obecnyStan = this.stan.wyjscie
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.pedY = 0
        this.rodzaj = r
        this.typ = "grzyb"
    }
}