export enum Country {
    NilCountry = 0,     // no, or invalid country
    Canada = 50001,     // Canada shares the same country calling code (+1) as the United States.
    America = 1,
    Russia = 7,
    Egypt = 20,
    SouthAfrica = 27,
    Greece = 30,
    Netherlands = 31,
    Belgium = 32,
    France = 33,
    Spain = 34,
    Hungary = 36,
    Italy = 39,
    Romania = 40,
    Switzerland = 41,
    Austria = 43,
    UnitedKingdom = 44,
    Denmark = 45,
    Sweden = 46,
    Norway = 47,
    Poland = 48,
    Germany = 49,
    Peru = 51,
    Mexico = 52,
    Cuba = 53,
    Argentina = 54,
    Brazil = 55,
    Chile = 56,
    Colombia = 57,
    Venezuela = 58,
    Malaysia = 60,
    Australia = 61,
    Indonesia = 62,
    Philippines = 63,
    NewZealand = 64,
//Pitcairn                    = 50064,
    Singapore = 65,
    Thailand = 66,
    Japan = 81,
    SouthKorea = 82,
    Vietnam = 84,
    China = 86,
    Turkey = 90,
    India = 91,
    Pakistan = 92,
    Afghanistan = 93,
    SriLanka = 94,
    Myanmar = 95,
    Iran = 98,
    SouthSudan = 211,
    Morocco = 212,
    WesternSahara = 50212,
    Algeria = 213,
    Tunisia = 216,
    Libya = 218,
    Gambia = 220,
    Senegal = 221,
    Mauritania = 222,
    Mali = 223,
    Guinea = 224,
    IvoryCoast = 225,
    BurkinaFaso = 226,
    Niger = 227,
    Togo = 228,
    Benin = 229,
    Mauritius = 230,
    Liberia = 231,
    SierraLeone = 232,
    Ghana = 233,
    Nigeria = 234,
    Chad = 235,
    CentralAfricanRepublic = 236,
    Cameroon = 237,
    CapeVerde = 238,
    SaoTomeAndPrincipe = 239,
    EquatorialGuinea = 240,
    Gabon = 241,
    RepublicOfTheCongo = 242,
    DemocraticRepublicOfTheCongo = 243,
    Angola = 244,
    GuineaBissau = 245,
    BritishIndianOceanTerritory = 246,
    Seychelles = 248,
    Sudan = 249,
    Rwanda = 250,
    Ethiopia = 251,
    Somalia = 252,
    Djibouti = 253,
    Kenya = 254,
    Tanzania = 255,
    Uganda = 256,
    Burundi = 257,
    Mozambique = 258,
    Zambia = 260,
    Madagascar = 261,
    Mayotte = 262,
    Reunion = 262,
    Zimbabwe = 263,
    Namibia = 264,
    Malawi = 265,
    Lesotho = 266,
    Botswana = 267,
    Swaziland = 268,
    Comoros = 269,
    SaintHelena = 290,
    Eritrea = 291,
    Aruba = 297,
    FaroeIslands = 298,
    Greenland = 299,
    Gibraltar = 350,
    Portugal = 351,
    Luxembourg = 352,
    Ireland = 353,
    Iceland = 354,
    Albania = 355,
    Malta = 356,
    Cyprus = 357,
    Finland = 358,
    Bulgaria = 359,
    Lithuania = 370,
    Latvia = 371,
    Estonia = 372,
    Moldova = 373,
    Armenia = 374,
    Belarus = 375,
    Andorra = 376,
    Monaco = 377,
    SanMarino = 378,
    Vatican = 379,
    Ukraine = 380,
    Serbia = 381,
    Montenegro = 382,
    Kosovo = 383,
    Croatia = 385,
    Slovenia = 386,
    BosniaAndHerzegovina = 387,
    Macedonia = 389,
    CzechRepublic = 420,
    Slovakia = 421,
    Liechtenstein = 423,
    FalklandIslands = 500,
    Belize = 501,
    Guatemala = 502,
    ElSalvador = 503,
    Honduras = 504,
    Nicaragua = 505,
    CostaRica = 506,
    Panama = 507,
    SaintPierreAndMiquelon = 508,
    Haiti = 509,
    SaintBarthelemy = 590,
    SaintMartin = 590,
    Bolivia = 591,
    Guyana = 592,
    Ecuador = 593,
    Paraguay = 595,
    Suriname = 597,
    Uruguay = 598,
    Curacao = 599,
    NetherlandsAntilles = 50599,
    EastTimor = 670,
// Antarctica                   672  南极洲
    Brunei = 673,
    Nauru = 674,
    PapuaNewGuinea = 675,
    Tonga = 676,
    SolomonIslands = 677,
    Vanuatu = 678,
    Fiji = 679,
    Palau = 680,
    WallisAndFutuna = 681,
    CookIslands = 682,
    Niue = 683,
    Samoa = 685,
    Kiribati = 686,
    NewCaledonia = 687,
    Tuvalu = 688,
    FrenchPolynesia = 689,
    Tokelau = 690,
    Micronesia = 691,
    MarshallIslands = 692,
    NorthKorea = 850,
    HongKong = 852,
    Macau = 853,
    Cambodia = 855,
    Laos = 856,
    Bangladesh = 880,
    Taiwan = 886,
    Maldives = 960,
    Lebanon = 961,
    Jordan = 962,
    Syria = 963,
    Iraq = 964,
    Kuwait = 965,
    SaudiArabia = 966,
    Yemen = 967,
    Oman = 968,
    Palestine = 970,
    UnitedArabEmirates = 971,
    Israel = 972,
    Bahrain = 973,
    Qatar = 974,
    Bhutan = 975,
    Mongolia = 976,
    Nepal = 977,
    Tajikistan = 992,
    Turkmenistan = 993,
    Azerbaijan = 994,
    Georgia = 995,
    Kyrgyzstan = 996,
    Kazakhstan = 997,
    Uzbekistan = 998,
}

export const Countries = new Set(Object.values(Country))
export type t_country = Country