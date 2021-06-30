
class BloczekGrzybow {
    constructor(img, x, y, w, h, r) {
        this.obraz = new Obraz(img, 3408, 128, 16, 16)

        this.animacja = {
            pelny: new Obraz(img, 3408, 128, 16, 16),
            pusty: new Obraz(img, 3424, 128, 16, 16)
        }

        this.stan = {
            drganie: {
                licznik: 0,
                ruch: () => {
                    this.obecnyStan.licznik++
                    if (this.obecnyStan.licznik < 5) {
                        this.y -= 2
                    } else if (this.obecnyStan.licznik < 10) {
                        this.y += 2
                    } else {
                        this.obecnyStan.licznik = 0
                        this.obecnyStan = this.stan.spoczynek
                    }
                },
                animacja: () => {
                    if (this.pelny) {
                        this.obraz = this.animacja.pelny
                    } else this.obraz = this.animacja.pusty
                }
            },

            spoczynek: {
                ruch: () => {
                    this.y = this.sy
                },
                animacja: () => {
                    if (this.pelny) {
                        this.obraz = this.animacja.pelny
                    } else this.obraz = this.animacja.pusty
                }
            }
        }

        this.obecnyStan = this.stan.spoczynek
        this.x = x
        this.y = y
        this.sy = y // pozycja startowa
        this.w = w
        this.h = h
        this.pelny = true
        this.rodzaj = r
        this.typ = "bloczekGrzybow"
    }
}