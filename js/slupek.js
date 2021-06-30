
class Slupek {
    constructor(img, x, y, w, h) {
        this.obraz = new Obraz(img, 3584, 64, 16, 144)
        this.flaga = new Flaga(img, x - 24, y + 24, 48, 48)
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.typ = "slupek"
    }
}