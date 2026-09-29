# PAR3 photoshoot brief

A half-day shoot to give the new store real people wearing PAR3. Every shot below has a place on the website, and the file names match the site, so the photos can go straight in.

## The essentials

| | |
| --- | --- |
| **Length** | Half a day. Start around 7:00 for soft light and less heat. |
| **Where** | A golf course or driving range in Singapore, with the venue's written permission. Look for a fairway with trees and open sky, and a clubhouse or bench area for relaxed shots. |
| **Models** | 2 men who look like our customer: keen weekend golfers aged about 30–55, not fashion models. Having both an Asian model and a non-Asian model helps the site speak to golfers worldwide. Real golfers look right when swinging. |
| **Team** | A photographer (who can also shoot a few short video clips) and one person to steam garments, track the shot list and check that logos are straight. |
| **Sizes to bring** | Each model's size in every item, plus one size up and one size down. |

## Styling rules

- **No other brands in frame.** Use plain white caps and gloves, and shoes with small or no logos. Tape over or turn away club and bag logos. The photo you liked worked because nothing competed with the clothes.
- Steam every garment and check it between shots. Make sure the PARIII chest logo sits straight.
- Shoot the shirt both tucked in (for golf) and untucked (for the clubhouse).
- Keep hands out of the way of logos and prints.
- Hold a grey card in the first frame of each setup, so the 5 shirt colours can be matched accurately afterwards.

## Shot list

### 1. Home page banner (the most important shot)
- A golfer on the fairway, relaxed and confident, in the **Black Solid Active Wear Shirt and the Nautical Golf Short**.
- **Wide (landscape):** 16:9, at least 2400 × 1350 px, with the model on the **right third**. The headline and buttons sit over the left side.
- **Tall (for phones):** 4:5, at least 1600 × 2000 px, with the model in the upper two-thirds. The text sits over the bottom.
- Take plenty of variations: standing, leaning on a club, walking with a bag, a laugh mid-conversation.
- Files: `hero-fairway.jpg` and `hero-fairway-phone.jpg`

### 2. Shop the look (the clickable outfit)
- Full length, head to shoes, in the **Black Solid Active Wear Shirt and the Nautical Golf Short**. Front-on or a slight three-quarter turn.
- The whole outfit should be clearly visible, with nothing covering the shirt or shorts.
- 4:5, at least 1600 × 2000 px.
- File: `look-weekend-round.jpg`

### 3. On-model shots for each product and colour
This is the photo shoppers see when they hover over a product or open its gallery. Use **the same pose, framing and light for every colour**, so switching colours on the site looks seamless.

| Product | Colours | Framing | File names |
| --- | --- | --- | --- |
| PAR3 Solid Active Wear Shirt | Green, Navy Blue, Orange, Sky Blue, Black | Head to mid-thigh, front | `solid-shirt-<colour>-model.jpg` |
| PAR3 Pilot Stripes Shirts | Green, Navy Blue, Red, Black, Blue | Head to mid-thigh, front | `pilot-stripes-<colour>-model.jpg` |
| PAR3 New Golf Polo Shirt | Its 8 colours | Head to mid-thigh, front | `new-golf-polo-<colour>-model.jpg` |
| PAR3 Unique Design Shirt and Polo T-shirt | Every colour | Head to mid-thigh, front | `unique-design-<colour>-model.jpg` |
| Printed shorts: Nautical, Hanabi, Lucky Clover, Tropical Vibe | One each | Waist to shoes, front, plus one from behind to show the back logo | `<name>-short-model.jpg`, `<name>-short-model-back.jpg` |
| Plain and Breathable shorts | Every colour | Waist to shoes, front | `<name>-short-model.jpg` |
| Golf pants | Every colour | Waist to shoes, front and side | `<name>-pants-model.jpg` |

All 4:5, at least 1600 × 2000 px. Colour names in files are lowercase with hyphens: `green`, `navy`, `orange`, `sky-blue`, `black`.

### 4. Product photos on white (to fill the gaps)
- Every product already has photos from par3.com.sg, but some colours have only one. The New Golf Polo and the Unique Design shirts have one photo per colour.
- Shoot the **front and back of those colours** on the same setup as the existing photos: square, pure white background, the same angle.
- Files: `<product>-<colour>-front.jpg`, `<product>-<colour>-back.jpg`

### 5. Details
Close-ups that sell quality:
- The Nautical print
- The PARIII chest logo and the woven neck label
- The collar and buttons
- The shorts' waistband and back pocket
- The fabric stretching as a hand pulls it (StretchTech)

4:5 or square. Files: `detail-<what>.jpg`

### 6. On the course (the "human touch")
- Swing (at the top of the backswing and the follow-through), lining up a putt, walking off the green together, a handshake at the 18th, and a drink at the clubhouse.
- At least one shot of **2–3 friends together**.
- A mix of landscape and 4:5. These go on the About page, category tiles and social media.
- Files: `course-<moment>.jpg`

### 7. Short video (optional, if time allows)
- 5–10 second clips, filmed vertically: a swing in the Nautical shorts, the fabric moving in the breeze, a walk down the fairway.
- For social media ads and a future moving banner.

## Delivery from the photographer

- Edited JPGs in sRGB, with a long edge of at least 2400 px, named as above. Include the full-size originals too.
- Colour-matched to the grey card, so each shirt colour looks the same as in real life.
- Keep retouching natural: fix creases and stray threads, but don't change the fabric, fit or print.

## Paperwork before the shoot

- **Model release forms** signed by every model, covering worldwide online, social and advertising use with no end date.
- **Photographer contract** giving PAR3 the rights to use the photos everywhere, for good, including ads.
- **Venue permission** in writing.

## How the photos go onto the site

Put the files in `par3/assets/img/`. On-model photos can come straight from the shoot; the site crops them to fit. Then:

1. **Banner:** set `HERO.photo` and `HERO.phone` in `assets/js/config.js`.
2. **Shop the look:** set `photo` in `LOOKS` in `assets/js/products.js`, and position the clickable markers on the shirt and shorts (`x`/`y` as % of the photo).
3. **Products:** the simplest route is to add the new photos to each product on par3.com.sg (on-model photo second), then re-run `python3 par3/tools/import_par3.py`, which picks them up automatically.

Or send the photos to Claude and they'll be added for you.
