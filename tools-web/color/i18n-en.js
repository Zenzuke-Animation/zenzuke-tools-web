/* Conversor de color — textos en inglés.
   El español vive dentro de app.js y de index.html (es el idioma original de la herramienta).
   Aquí va solo el inglés: interfaz, nombres de grupo, etiquetas de ficha y las 26 fichas.
   Los números van con punto decimal, como corresponde al inglés: 0.04045, gamma 2.4, (0.640 · 0.330). */
window.MT_COLOR_EN = {
  ui: {
    'doc.title': 'Color converter',
    'h1': 'Color converter',
    'lede': 'Type an sRGB color on the left. In the middle you pick the format and see what it is, with which gamma and what it is used for. On the right you get that same color converted to that format: the values you copy so it looks the same.',
    'h2.original': 'Original color',
    'label.hex': 'Hexadecimal',
    'h2.formato': 'Format',
    'select.aria': 'Conversion format',
    'h2.conversion': 'Conversion',

    'fila.01': '0 to 1',
    'fila.8': '8 bit',
    'fila.16': '16 bit',
    'fila.hex': 'hex',
    'fila.nota': 'note',
    'recortado': '(clipped)',

    'nota.ycbcr': 'Y′, Cb and Cr are not red, green and blue, so there is no swatch and no hex here: there would be nothing to show on screen.',
    'nota.modelo': 'This format is not an on-screen RGB triplet, so there is no swatch and no 8- and 16-bit integers: its numbers use another scale and another unit.',
    'nota.leido': 'The swatch shows the values coded in {nombre} read as if they were sRGB. It is the reference for the on-screen eyedropper: what you copy there is the 8-bit value you see in the list.',
    'nota.flotante': 'In this format you would normally work in float: the integers and the hex are a reading of the values, not a usual file format.',

    'aviso.full': 'Full range: 0 to 255, no reserved margin, neutral grey at 128.',
    'aviso.legal': 'Legal range: Y from 16 to 235, Cb and Cr from 16 to 240, neutral grey at 128.',
    'aviso.recortado': ' The color falls outside those values, so the numbers are clipped.',
    'aviso.gamut': 'The color does not fit in the gamut of {nombre} in {canales}. The 0 to 1 values keep the real value; the integers, the hex and the swatch are clipped to the closest color that format can actually represent.',
  },

  grupos: {
    'Pantalla, web y vídeo': 'Screen, web and video',
    'Foto e imprenta': 'Photo and print',
    'Cine y VFX': 'Film and VFX',
    'Medición y referencia': 'Measurement and reference',
    'Vídeo YCbCr': 'YCbCr video',
  },

  fichaEtiquetas: {
    primarias: 'Primaries',
    blanco: 'White point',
    curva: 'Curve and gamma',
    uso: 'Use',
    profundidad: 'Bit depth',
    nota: 'Heads-up',
  },

  origen: {
    espacio: 'Space',
    primarias: 'Primaries',
    blanco: 'White point',
    curva: 'Curve',
    profundidad: 'Bit depth',
    nota: 'Note',
    valores: {
      espacio: 'sRGB (IEC 61966-2-1)',
      primarias: 'sRGB and Rec.709: red (0.640 · 0.330), green (0.300 · 0.600), blue (0.150 · 0.060)',
      blanco: 'D65 (0.3127 · 0.3290)',
      curva: "sRGB function: a linear segment below 0.04045 and an exponent of 2.4 above it, which is equivalent to a <b>gamma ≈ 2.2</b> in the midtones",
      profundidad: '8 bit, 0 to 255',
      nota: "The original's white point only comes into play when the destination format uses another one (D50 in ProPhoto and Lab, D60 in ACES, theatrical white in DCI-P3): then the color is adapted with the Bradford method and the values shift. If the destination is D65 as well, there is no adaptation at all.",
    },
  },

  espacios: {
    srgb: {
      nombre: 'sRGB',
      ficha: {
        texto: 'This is the starting point and the space browsers, design tools and consumer displays use by default. Its primaries are exactly the same as HD video (Rec.709), so the gamut matches: what changes compared with video is the encoding curve, not the colors that fit.',
        primarias: 'sRGB and Rec.709: red (0.640 · 0.330), green (0.300 · 0.600), blue (0.150 · 0.060)',
        blanco: 'D65 (0.3127 · 0.3290), the same as the original color',
        curva: 'sRGB function: a linear segment below 0.04045 and an exponent of 2.4 above it. The figure you always see quoted is gamma 2.2, which is its equivalent behaviour in the midtones, but the real curve is not a pure power.',
        uso: 'Interfaces, web, CSS, home photography, hex values.',
        profundidad: '8 bit, 0 to 255, with a linear segment in the shadows so blacks do not clump.',
      },
    },
    r709: {
      nombre: 'Rec.709, display gamma 2.4',
      ficha: {
        texto: 'The HD video standard. It shares primaries and white point with sRGB, so there is no gamut difference here: what changes is the display curve, and that curve is a pure gamma of 2.4, the BT.1886 recommendation for reference monitors.',
        primarias: 'Rec.709 (identical to sRGB)',
        blanco: 'D65, same as the original',
        curva: 'Display gamma 2.4. With no linear segment, midtones come out lighter than in sRGB: this grey 128 will end up at 135. A black of 0 is still 0 and a white of 255 is still 255.',
        uso: 'HD video, editing on a monitor calibrated to 2.4, broadcast masters and deliveries.',
        profundidad: '8 and 10 bit. It is the format SDR HD video is usually tagged with.',
        nota: 'Not to be confused with the camera curve of the same standard: they are two different things sharing one name.',
      },
    },
    r709cam: {
      nombre: 'Rec.709, camera curve',
      ficha: {
        texto: "The same Rec.709 but with the curve used to encode the signal when it is captured, the standard's OETF, not the monitor one. This is the one you find in camera files and in material that is not yet ready to be viewed directly.",
        primarias: 'Rec.709',
        blanco: 'D65',
        curva: 'Camera OETF: a linear segment below 0.018 and above it V = 1.099 · L^0.45 − 0.099. Compare it with the 2.4 display gamma: they are different curves, which is why the values do not match.',
        uso: 'Capture signal, camera ProRes, tapes and files from before color grading.',
        profundidad: '8 and 10 bit.',
      },
    },
    r2020: {
      nombre: 'Rec.2020, display gamma 2.4',
      ficha: {
        texto: 'The UHD television standard. Its primaries are considerably wider than those of sRGB and Rec.709, so most saturated colors drop in value: the same pure sRGB red fills only 82% of the red available here.',
        primarias: 'Rec.2020: red (0.708 · 0.292), green (0.170 · 0.797), blue (0.131 · 0.046)',
        blanco: 'D65, same as the original, so there is no adaptation',
        curva: 'Display gamma 2.4, the same convention as HD.',
        uso: '4K and 8K broadcast, UHD reference monitors, HDR containers.',
        profundidad: '10 and 12 bit in practice; 8 bit falls short for this gamut.',
      },
    },
    r2020cam: {
      nombre: 'Rec.2020, camera curve',
      ficha: {
        texto: 'Rec.2020 with the capture curve instead of the display one. It is used in the UHD camera signal and in HDR material before tone mapping.',
        primarias: 'Rec.2020',
        blanco: 'D65',
        curva: 'Same camera OETF as Rec.709 (1.099 and 0.45) but over the wide 2020 primaries.',
        uso: 'UHD capture signal, wide-gamut camera files.',
        profundidad: '10 and 12 bit.',
      },
    },
    dcip3: {
      nombre: 'DCI-P3, gamma 2.6 and theatrical white',
      ficha: {
        texto: 'The digital cinema projection space, the one DCPs use. It has P3 primaries and two things that set it apart from everything else: a gamma of 2.6, more contrasty than video, and a projection white of its own, more yellow than D65.',
        primarias: 'P3: red (0.680 · 0.320), green (0.265 · 0.690), blue (0.150 · 0.060)',
        blanco: 'Theatrical white (0.314 · 0.351), different from the original, so chromatic adaptation does happen here and you will notice it in the values',
        curva: 'Projection gamma 2.6. It is the highest gamma in the list: midtones sit darker and contrast goes up.',
        uso: 'DCP, projection booths, digital cinema masters.',
        profundidad: '12 bit in the cinema chain (XYZ coded for DCP).',
        nota: 'This is not the P3 of monitors: see Display P3.',
      },
    },
    dp3: {
      nombre: 'Display P3',
      ficha: {
        texto: 'The P3 carried by Apple monitors and devices and by a good share of high-end screens. It uses the cinema primaries (P3) but with the sRGB curve and D65 white, so it is wider than sRGB without changing contrast or white point.',
        primarias: 'P3, wider than sRGB especially in red and green',
        blanco: 'D65, same as the original',
        curva: 'The sRGB function, the one of the original color: same equivalent gamma of 2.2 and same linear segment in the shadows.',
        uso: 'iPhone, iPad, Mac, high-end phones and laptops, screen files.',
        profundidad: '8 and 10 bit.',
      },
    },
    r601ntsc: {
      nombre: 'Rec.601 NTSC (SMPTE-C)',
      ficha: {
        texto: 'The American and Japanese SD video standard, the 525-line one. Its primaries are slightly narrower than sRGB, so saturated colors fall outside the gamut easily and have to be clipped.',
        primarias: 'SMPTE-C: red (0.630 · 0.340), green (0.310 · 0.595), blue (0.155 · 0.070)',
        blanco: 'D65',
        curva: 'Gamma 2.2, the classic convention of standard-definition video.',
        uso: 'Old SD material, NTSC DV, tape transfers.',
        profundidad: '8 bit, usually in YCbCr rather than RGB.',
      },
    },
    r601pal: {
      nombre: 'Rec.601 PAL (EBU)',
      ficha: {
        texto: 'European SD, the 625-line one. The EBU primaries match sRGB in red and blue, with green slightly different, so the gamut is very close to the original and clipping is minor.',
        primarias: 'EBU: red (0.640 · 0.330), green (0.290 · 0.600), blue (0.150 · 0.060)',
        blanco: 'D65',
        curva: 'Gamma 2.2, the SD video one.',
        uso: 'DV PAL, European archive material, Betacam tapes.',
        profundidad: '8 bit, in YCbCr.',
      },
    },
    adobe: {
      nombre: 'Adobe RGB (1998)',
      ficha: {
        texto: 'A photography space intended for print: it keeps the red and blue of sRGB and stretches green, which is where print colors were falling outside. Magentas and intense greens fit better.',
        primarias: 'Adobe RGB: red (0.640 · 0.330), green (0.210 · 0.710), blue (0.150 · 0.060)',
        blanco: 'D65',
        curva: 'Gamma 2.199, written in the standard as the exact fraction 563/256, slightly different from the 2.2 of video.',
        uso: 'Photography, retouching, CMYK conversion for print.',
        profundidad: '8 and 16 bit.',
      },
    },
    prophoto: {
      nombre: 'ProPhoto (ROMM RGB)',
      ficha: {
        texto: 'The widest space in the list, intended for developing RAW without losing information. It contains colors that do not exist on screen and cannot be printed, so values may fall outside 0 and 1 without that being an error.',
        primarias: 'ROMM: red (0.7347 · 0.2653), green (0.1596 · 0.8404), blue (0.0366 · 0.0001)',
        blanco: 'D50 (0.3457 · 0.3585), the graphic-arts white, different from the original: here the color is adapted and the values shift',
        curva: 'Gamma 1.8 with a linear segment below 1/512. It is the softest curve in the list.',
        uso: 'RAW development, print workflow, photography master files.',
        profundidad: '16 bit by standard.',
      },
    },
    lin: {
      nombre: 'Linear sRGB',
      ficha: {
        texto: 'sRGB with the curve taken out. Here the numbers are proportional to light: twice the value is twice the light, something the display curve breaks. This is what light calculations, blends, blurs and rendering want.',
        primarias: 'sRGB',
        blanco: 'D65',
        curva: 'None: no gamma. That is why an sRGB grey of 128 reads 0.2159 here instead of 0.502.',
        uso: 'Compositing, motion blur, blends, 3D rendering, lighting.',
        profundidad: 'Floating point. In this space integers and hex are only a reading, not a real file format.',
      },
    },
    acescg: {
      nombre: 'ACEScg (AP1 linear)',
      ficha: {
        texto: 'The ACES working space for VFX and 3D animation in linear. Its primaries are wider than cinema ones and its white is the D60 of ACES, the same one every piece of the chain uses.',
        primarias: 'AP1: red (0.713 · 0.293), green (0.165 · 0.830), blue (0.128 · 0.044)',
        blanco: 'D60 (0.3217 · 0.3377), the ACES one, different from the original',
        curva: 'None: linear, with values proportional to light.',
        uso: 'Rendering, Nuke, Maya, compositing in an ACES workflow.',
        profundidad: 'Floating point, 16 or 32 bit per channel.',
      },
    },
    aces2065: {
      nombre: 'ACES2065-1 (AP0 linear)',
      ficha: {
        texto: 'The ACES interchange and archival space. Its AP0 primaries are so wide that they hold the entire visible spectrum inside positive values, which is why it is used for delivering and archiving, not for working.',
        primarias: 'AP0: red (0.7347 · 0.2653), green (0.0000 · 1.0000), blue (0.0001 · -0.0770)',
        blanco: 'D60, the ACES one',
        curva: 'None: linear.',
        uso: 'Delivery and archiving of ACES masters, interchange OpenEXR.',
        profundidad: 'Floating point, usually half float (16 bit per channel).',
      },
    },
    acescc: {
      nombre: 'ACEScc',
      ficha: {
        texto: 'ACES base-2 logarithmic encoding, designed for the color wheels of grading applications. With no linear segment, black sits at a high value and shadows are graded very gently.',
        primarias: 'AP1',
        blanco: 'D60',
        curva: 'Log base 2: V = (log2(L) + 9.72) / 17.52 above 2 to the power of −15, with a transition zone below. Absolute black lands at 0.0729 and white at 0.5548.',
        uso: 'Color grading in an ACES workflow, above all in the classic tools.',
        profundidad: 'Half float.',
        nota: 'Be careful with hex in this format: ACEScc values are not screen colors, they are a grading curve.',
      },
    },
    acescct: {
      nombre: 'ACEScct',
      ficha: {
        texto: 'Same as ACEScc but with a linear segment in the shadows, added on purpose so black behaves as it does in traditional applications. It is the variant used by default in grading today.',
        primarias: 'AP1',
        blanco: 'D60',
        curva: 'Log base 2 above 0.0078125 and a linear segment below, with a slope of 10.54. Blacks behave the way the eye expects.',
        uso: 'Grading in DaVinci Resolve, Baselight and the like, inside ACES.',
        profundidad: 'Half float.',
      },
    },
    xyz65: {
      nombre: 'XYZ (CIE 1931, D65)',
      ficha: {
        texto: 'The 1931 CIE space, the reference every other one comes from. It is not a screen space: it describes color as it is, independently of any device, which is why it is used as a bridge between formats.',
        primarias: 'It has no primaries of its own: it is the reference system',
        blanco: 'D65',
        curva: 'None, and its values do not look like a screen\'s: white reads 0.9505 · 1.0000 · 1.0891.',
        uso: 'Calculation, measurement, conversion between spaces, ICC profiles.',
        profundidad: 'Floating point.',
      },
    },
    xyz50: {
      nombre: 'XYZ (CIE 1931, D50)',
      ficha: {
        texto: 'The same XYZ but referred to the D50 white, the graphic-arts one. It is the natural intermediate step before Lab and everything to do with print and paper.',
        primarias: 'Reference system',
        blanco: 'D50, different from the original: here the color is adapted',
        curva: 'None.',
        uso: 'Path to Lab, printer profiles, color comparison.',
        profundidad: 'Floating point.',
      },
    },
    lab: {
      nombre: 'Lab (D50)',
      ficha: {
        texto: 'A perceptual space designed so that similar distances between numbers are seen as similar differences. It separates lightness (L) from color: two colors with the same L have the same perceived brightness even if their RGB values look nothing alike.',
        primarias: 'Not applicable: it is a model derived from XYZ',
        blanco: 'D50',
        curva: 'There is no gamma: there is a compression function with an exponent of 1/3 and a step below 0.008856. L runs from 0 to 100, a and b from around −128 to 127.',
        uso: 'Comparing colors, print tolerances, image analysis.',
        profundidad: 'Floating point.',
        nota: 'Here hex and integers make no sense: they are three numbers on another scale.',
      },
    },
    lch: {
      nombre: 'LCh (D50)',
      ficha: {
        texto: 'The same Lab in polar coordinates: instead of a and b, chroma and hue angle. It is handier for moving saturation and hue independently without changing lightness.',
        primarias: 'Not applicable',
        blanco: 'D50',
        curva: 'There is no gamma. L from 0 to 100, C from 0 to about 130 and h in degrees from 0 to 360.',
        uso: 'Hue-based color adjustments, palettes, selections.',
        profundidad: 'Floating point.',
      },
    },
    hsl: {
      nombre: 'HSL',
      ficha: {
        texto: 'It is not a color space, it is another way of writing the same sRGB: hue in degrees, saturation and lightness in percent. Handy for generating variations, but it does not describe how the color looks or how light treats it.',
        primarias: "sRGB's, because it works on top of sRGB",
        blanco: 'D65',
        curva: "sRGB's, already applied before converting.",
        uso: 'Palettes, CSS values, quick hue and saturation adjustments.',
        profundidad: 'H, S and L with decimals.',
      },
    },
    hsv: {
      nombre: 'HSV',
      ficha: {
        texto: "HSL's cousin: hue, saturation and value. It is the model of classic color pickers and painting applications, because with V and S at maximum you see the most vivid color possible on screen.",
        primarias: "sRGB's",
        blanco: 'D65',
        curva: "sRGB's.",
        uso: 'Color pickers, digital painting, generating variants.',
        profundidad: 'H, S and V with decimals.',
      },
    },
    y601: {
      nombre: 'YCbCr Rec.601 (legal range)',
      ficha: {
        texto: 'The SD video format. Instead of three colors it stores one brightness value and two color differences, which is what color television systems did to stay compatible with black-and-white receivers. With legal range the 16 and 235 margins are reserved for synchronisation, so 16 is black and 235 is white.',
        primarias: 'SMPTE-C, the American SD ones',
        blanco: 'D65',
        curva: 'Encoded with gamma 2.2 before computing luma. Y = 0.299 R + 0.587 G + 0.114 B.',
        uso: 'SD tapes, DV, old capture cards, archive material.',
        profundidad: '8 bit: Y from 16 to 235, Cb and Cr from 16 to 240, with neutral grey at 128.',
        nota: 'There is no hex and no screen simulation here: Y, Cb and Cr are not red, green and blue.',
      },
    },
    y709: {
      nombre: 'YCbCr Rec.709 (legal range)',
      ficha: {
        texto: 'The format almost all HD video travels in: H.264, HEVC, ProRes and broadcast signals. It stores luma and two color differences because the eye distinguishes brightness far better than color detail, so color can be compressed without it showing.',
        primarias: 'Rec.709',
        blanco: 'D65',
        curva: 'Computed on the values encoded with the camera OETF. Y = 0.2126 R + 0.7152 G + 0.0722 B.',
        uso: 'HD, H.264 and HEVC, ProRes, televisions, capture cards.',
        profundidad: '8 and 10 bit. In legal range: 16 to 235 for Y, 16 to 240 for Cb and Cr.',
        nota: 'This is the format you hear about when a video looks "washed out": it is almost always a file tagged as legal played back as full, or the other way round.',
      },
    },
    y709f: {
      nombre: 'YCbCr Rec.709 (full range)',
      ficha: {
        texto: 'The same Rec.709 but using the whole available range: 0 is black and 255 is white, with no reserved margin. It is what many home files, screen recordings and phone or game captures come in.',
        primarias: 'Rec.709',
        blanco: 'D65',
        curva: 'Camera OETF, same as the legal variant. Y = 0.2126 R + 0.7152 G + 0.0722 B.',
        uso: 'Home recordings, screen captures, phones, consoles.',
        profundidad: '8 bit: Y from 0 to 255 and Cb and Cr from 0 to 255, with neutral grey at 128.',
      },
    },
    y2020: {
      nombre: 'YCbCr Rec.2020 (legal range)',
      ficha: {
        texto: 'The UHD television format. Same idea of luma and color differences, but with the wide Rec.2020 primaries and different luma coefficients, because green carries more weight in this gamut.',
        primarias: 'Rec.2020',
        blanco: 'D65',
        curva: 'Camera OETF over the 2020 primaries. Y = 0.2627 R + 0.6780 G + 0.0593 B.',
        uso: 'UHD, HDR content, 4K broadcast deliveries.',
        profundidad: '10 bit by standard; 12 bit in high-quality flows.',
      },
    },
  },
};

/* Los textos fijos de index.html se traducen con el módulo de idioma; los de las fichas y
   los de la conversión los pide app.js de este mismo objeto. */
if (window.MT_I18N && window.MT_I18N.dict) MT_I18N.dict({ en: window.MT_COLOR_EN.ui });
