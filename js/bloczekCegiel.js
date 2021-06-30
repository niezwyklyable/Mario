
class BloczekCegiel {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3440, 128, 16, 16)

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
                }
            },

            spoczynek: {
                ruch: () => {
                    this.y = this.sy
                }
            }
        }

        this.obecnyStan = this.stan.spoczynek
        this.x = x
        this.y = y
        this.sy = y // pozycja startowa
        this.w = w
        this.h = h
        this.typ = "bloczekCegiel"
    }
}