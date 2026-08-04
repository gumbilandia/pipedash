from PIL import Image, ImageDraw

def draw_hero(size):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    s = size / 64.0
    def R(x1,y1,x2,y2,color):
        d.rectangle([x1*s, y1*s, x2*s, y2*s], fill=color)

    # background circle
    d.ellipse([2*s,2*s,62*s,62*s], fill=(92,148,252,255))

    # cap (red)
    R(16,10,48,20,(216,40,32,255))
    R(12,18,52,24,(216,40,32,255))
    # cap emblem
    R(28,12,36,18,(255,255,255,255))

    # face (skin tone)
    R(18,22,46,34,(255,201,150,255))
    # mustache
    R(18,30,46,34,(90,55,30,255))
    # eyes
    R(24,24,28,28,(30,30,30,255))
    R(36,24,40,28,(30,30,30,255))
    # nose
    R(30,26,36,32,(255,180,130,255))

    # overalls (blue) body
    R(16,34,48,52,(0,92,180,255))
    # shirt sleeves (red) peeking
    R(14,34,20,44,(216,40,32,255))
    R(44,34,50,44,(216,40,32,255))
    # overalls buttons
    R(24,38,28,42,(255,214,0,255))
    R(36,38,40,42,(255,214,0,255))
    # shoes
    R(16,52,28,58,(90,55,30,255))
    R(36,52,48,58,(90,55,30,255))

    return img

for size in (192, 512):
    img = draw_hero(size)
    img.save(f"icons/icon-{size}.png")

print("done")
