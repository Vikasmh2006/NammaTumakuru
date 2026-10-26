import sqlite3
import os
import shutil
from datetime import datetime
from flask import Flask, render_template, request, jsonify

# Expose global Flask application instance for Vercel WSGI/serverless handler
app = Flask(__name__)

# Serverless environment handling: Vercel functions have read-only root filesystems, but /tmp is writable
BASE_DIR = os.path.dirname(__file__)
SRC_DB = os.path.join(BASE_DIR, 'feedback.db')

if os.environ.get('VERCEL'):
    DB_PATH = os.path.join('/tmp', 'feedback.db')
    if not os.path.exists(DB_PATH) and os.path.exists(SRC_DB):
        shutil.copyfile(SRC_DB, DB_PATH)
else:
    DB_PATH = SRC_DB

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            destination TEXT DEFAULT 'Heritage Circuit',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Check if sample entries exist; if not, seed realistic traveler reviews
    cursor.execute('SELECT COUNT(*) FROM feedback')
    count = cursor.fetchone()[0]
    if count == 0:
        sample_reviews = [
            ("Ananya Rao", 5, "Visited Sree Siddaganga Mutt during the morning prayer. The serenity, free dasoha meal, and disciplined atmosphere are truly spiritually uplifting. Proud of our Karnataka heritage!", "Sree Siddaganga Mutt", "2026-10-24 09:30:00"),
            ("Karthik Hegde", 5, "The trek to Madhugiri Fort was exhilarating! Asia's second largest monolith is challenging but the stone path architecture and 360-degree hilltop views are worth every drop of sweat.", "Madhugiri Fort", "2026-10-24 16:15:00"),
            ("Dr. Ramesh Kumar", 4, "Devarayanadurga morning breeze and the car festival vibe are unforgettable. Namada Chilume spring nearby in the deer park is also very calming.", "Devarayanadurga", "2026-10-25 11:20:00"),
            ("Sneha Murthy", 5, "Mandaragiri's peacock-feather Pinchi dome is an architectural masterpiece! Combined with the Mydala lake sunset, it made our Tumkur day-trip magical.", "Mandaragiri Jain Temple", "2026-10-25 18:45:00"),
            ("Praveen Gowda", 5, "Don't miss SGS Gundu Palav and Vilasi Delight when you are in Tumkur. Food is authentic and local hospitality is top notch!", "Culinary Experience", "2026-10-26 08:10:00")
        ]
        cursor.executemany('''
            INSERT INTO feedback (name, rating, comment, destination, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_reviews)
    
    conn.commit()
    conn.close()

# Initialize DB on module import so it's ready in serverless environments
init_db()

# Destination master data with exact coordinates and rich content
DESTINATIONS = [
    {
        "id": "siddaganga",
        "name": "Sree Siddaganga Mutt",
        "kannada": "ಶ್ರೀ ಸಿದ್ಧಗಂಗಾ ಮಠ",
        "lat": 13.3221,
        "lng": 77.1264,
        "category": "Spiritual Legacy & Social Service",
        "tag": "Spiritual Center",
        "image": "static/images/siddaganga.jpg",
        "summary": "Founded in the 15th century, Siddaganga Mutt is a monumental pilgrimage and philanthropic center renowned worldwide for providing free food ('Dasoha'), shelter, and education to over 10,000 underprivileged children daily.",
        "highlights": [
            "Centuries-old educational legacy nurtured by the revered 'Walking God' Dr. Sree Sree Shivakumara Swamiji",
            "Continuous Trividha Dasoha (free Anna, Akshara, and Ashraya) serving thousands daily",
            "Spectacular annual agricultural fair and January Jatra Mahotsava drawing millions of devotees",
            "Ancient hill-slope shrine dedicated to Siddhalingeshwara and historical Kalyani stepwell"
        ],
        "timings": "06:00 AM - 08:30 PM daily",
        "best_time": "October to March (Special during January Jatra)",
        "entry_fee": "Free Admission (Dasoha is open to all visitors)",
        "elevation": "850 m above sea level",
        "distance_hint": "~6 km from Tumakuru City Center"
    },
    {
        "id": "devarayanadurga",
        "name": "Devarayanadurga",
        "kannada": "ದೇವರಾಯನದುರ್ಗ",
        "lat": 13.3734,
        "lng": 77.2111,
        "category": "Hill Station & Sacred Temples",
        "tag": "Hill Sanctuary",
        "image": "static/images/devarayanadurga.jpg",
        "summary": "A tranquil hill station nestled in rocky crags and dry deciduous forest at 1,188m elevation. It houses the famed twin shrines: Bhoga Narasimha at the base and Yoga Narasimha on the scenic cliff summit.",
        "highlights": [
            "Twin sacred shrines: Sri Bhoga Narasimha Swamy (foothills) and Sri Yoga Narasimha Swamy (hilltop)",
            "Traditional Temple Car Festivals (Brahmarathotsava) celebrated with grand wooden chariots and rural vibrancy",
            "Kalyana Teertha holy spring and vantage viewpoints offering panoramic views of Tumakuru district",
            "Rich flora and fauna harboring leopard habitats and rare medicinal herbs"
        ],
        "timings": "08:00 AM - 06:30 PM",
        "best_time": "July to February (Pleasant monsoon and winter mist)",
        "entry_fee": "Free (Temple Darshan); Nominal hill road vehicle toll",
        "elevation": "1,188 m above sea level",
        "distance_hint": "~16 km east of Tumakuru"
    },
    {
        "id": "madhugiri",
        "name": "Madhugiri Fort",
        "kannada": "ಮಧುಗಿರಿ ಬೆಟ್ಟ ಮತ್ತು ಕೋಟೆ",
        "lat": 13.6644,
        "lng": 77.2078,
        "category": "Monolithic Wonder & Historical Trekking",
        "tag": "Asia's Monolith",
        "image": "static/images/madhugiri.jpg",
        "summary": "Standing atop one of Asia’s largest monoliths (1,200m), Madhugiri Fort is a masterwork of military engineering constructed by the Vijayanagara chieftains and enhanced by Hyder Ali and Tipu Sultan with historic stone paths.",
        "highlights": [
            "Perched atop the second largest monolithic rock hill in Asia with breathtaking steep granite slopes",
            "Formidable multi-tiered defensive fortification with Antaralada Bagilu (internal gates) and bastions",
            "Steep historic stone-cut steps with safety iron railings providing a world-class adventure trek",
            "Summit ruins of the Gopalakrishna temple and historic granaries overlooking the Deccan plains"
        ],
        "timings": "06:00 AM - 05:30 PM (Trek starts best before 08:30 AM)",
        "best_time": "September to February (Avoid peak midday summer sun)",
        "entry_fee": "Free Admission (Protected ASI / State Monument)",
        "elevation": "1,200 m above sea level",
        "distance_hint": "~43 km north of Tumakuru"
    },
    {
        "id": "namadachilume",
        "name": "Namada Chilume",
        "kannada": "ನಾಮದ ಚಿಲುಮೆ",
        "lat": 13.3642,
        "lng": 77.1947,
        "category": "Eco-Tourism & Mythological Spring",
        "tag": "Perennial Spring",
        "image": "static/images/namadachilume.jpg",
        "summary": "A peaceful natural spring nestled deep within the Devarayanadurga reserve forest and deer park. Legend holds that Lord Rama made this fissure in the rock with his arrow to apply his 'Nama' (tilak) during his Vanavasa exile.",
        "highlights": [
            "Perennial natural freshwater spring that never runs dry, continuously welling up through a rocky cleft",
            "Surrounded by a dense green deer park sanctuary with spotted chital deer roaming peacefully",
            "Forested walking trails under canopies of teak, eucalyptus, and wild forest groves",
            "Ideal picnic and bird-watching destination popular among families and eco-travelers"
        ],
        "timings": "09:00 AM - 05:30 PM daily",
        "best_time": "Round the year (Lush post-monsoon greenery)",
        "entry_fee": "₹10 per adult; ₹5 per child (Forest Dept maintenance)",
        "elevation": "890 m above sea level",
        "distance_hint": "~14 km from Tumakuru"
    },
    {
        "id": "mandaragiri",
        "name": "Mandaragiri Jain Temple",
        "kannada": "ಮಂದಾರಗಿರಿ ಬೆಟ್ಟ (ಬಸದಿ ಬೆಟ್ಟ)",
        "lat": 13.2547,
        "lng": 77.1752,
        "category": "Jain Heritage & Architectural Wonder",
        "tag": "Pinchi Dome Icon",
        "image": "static/images/mandaragiri.jpg",
        "summary": "Popularly called Basadi Betta, this Jain heritage hill is globally famous for its unique 81-foot peacock-feather-shaped Pinchi dome (Guru Mandir) and the monolithic statue of Bhagwan Chandranatha overlooking serene Mydala Lake.",
        "highlights": [
            "World-famous 81-foot peacock-feather-shaped Pinchi dome architecture symbolizing non-violence and asceticism",
            "Easy 435-step climb up smooth granite rock suitable for travelers of all ages",
            "Four historic 12th-century Hoysala and Vijayanagara era Digambara Jain basadis atop the rock",
            "Pristine Mydala Lake reflecting the hills and blue Karnataka skies right behind the complex"
        ],
        "timings": "06:30 AM - 07:00 PM daily",
        "best_time": "October to March (Sunset at Mydala lake is unmissable)",
        "entry_fee": "Free Admission",
        "elevation": "840 m above sea level",
        "distance_hint": "~12 km south towards Bengaluru Highway"
    },
    {
        "id": "goravanahalli",
        "name": "Goravanahalli Mahalakshmi Temple",
        "kannada": "ಗೊರವನಹಳ್ಳಿ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಸ್ಥಾನ",
        "lat": 13.4883,
        "lng": 77.2625,
        "category": "Sacred Pilgrimage & Divine Blessings",
        "tag": "Revered Goddess Shrine",
        "image": "static/images/goravanahalli.jpg",
        "summary": "One of the most revered Shakti shrines in Karnataka, dedicated to Goddess Mahalakshmi. Devotees from across southern India arrive to seek blessings for prosperity, peace, and auspicious beginnings.",
        "highlights": [
            "Svayambhu (self-manifested) idol of Goddess Mahalakshmi radiating divine poise and grace",
            "Deep historical tradition initiated by Kamalamma who discovered and revived the deity's worship",
            "Free Annadana (sacred midday feast) served to all devotees and travelers visiting the temple",
            "Scenic location adjacent to the Theetha water reservoir offering cool evening breezes"
        ],
        "timings": "06:00 AM - 12:30 PM, 05:30 PM - 08:30 PM (Extended on Fridays & Tuesdays)",
        "best_time": "All year round (Special festivities during Navaratri and Deepavali)",
        "entry_fee": "Free General Darshan; Special Seva tickets available",
        "elevation": "790 m above sea level",
        "distance_hint": "~30 km north-east of Tumakuru via Koratagere"
    },
    {
        "id": "shivagange",
        "name": "Shivagange",
        "kannada": "ಶಿವಗಂಗೆ ಬೆಟ್ಟ",
        "lat": 13.1704,
        "lng": 77.2245,
        "category": "Dakshina Kashi & Cave Temples",
        "tag": "Sacred Shivalinga Peak",
        "image": "static/images/shivagange.jpg",
        "summary": "Hailed as the 'Dakshina Kashi' (Kashi of the South), Shivagange is a sacred conical mountain peak shaped like a Shivalinga with rock-cut cave temples dedicated to Gangadhareshwara and Honnadevi, and a natural spring springing from the rocks.",
        "highlights": [
            "Sacred mountain peak towering at 1,368 meters, shaped naturally like a mammoth Shiva Linga",
            "Mystical Gangadhareshwara Cave Temple where ghee offered to the linga miraculously turns into medicinal butter",
            "Olakkal Teertha spring deep inside narrow natural rock crevices and the thrilling Nandi carved at the summit precipice",
            "Ancient stone pathways flanked with carved stone mandapas dating back to the Hoysala dynasty"
        ],
        "timings": "06:00 AM - 06:00 PM daily",
        "best_time": "October to March (Cool breezes and clear panorama)",
        "entry_fee": "Free Admission",
        "elevation": "1,368 m above sea level",
        "distance_hint": "~25 km south of Tumakuru near Dobbaspet"
    },
    {
        "id": "kaidala",
        "name": "Kaidala Shri Chennakeshava Swamy Temple",
        "kannada": "ಕೈದಾಳ ಶ್ರೀ ಚೆನ್ನಕೇಶವ ಸ್ವಾಮಿ ದೇವಾಲಯ",
        "lat": 13.3150,
        "lng": 77.0392,
        "category": "Hoysala Architecture & Master Sculptor Heritage",
        "tag": "Amarashilpi Jakanachari Heritage",
        "image": "static/images/kaidala.jpg",
        "summary": "Birthplace and redemption sanctuary of Karnataka's legendary master sculptor Amarashilpi Jakanachari. Commissioned in 1150 AD during the Hoysala era, this historic Dravidian-Hoysala temple houses an exquisite 5.5-foot monolith idol of Lord Chennakeshava carved from dark soapstone (Krishna Shile), intricately carved with the Dashavatara.",
        "highlights": [
            "Legendary birthplace of master sculptor Amarashilpi Jakanachari, creator of Belur and Halebidu masterpieces",
            "Miraculous hand restoration: Jakanachari regained his severed right hand here after sculpting Chennakeshava, naming the town 'Kai-dala'",
            "Rare west-facing 5.5-foot monolith idol of Lord Chennakeshava carved with microscopic precision from dark Krishna Shile soapstone",
            "Historic 1150 AD Hoysala inscription commissioned by chieftain Samanta Bachi under King Narasimha I",
            "Massive stone compound prakara walls and ornate Vijayanagara-era Rajagopuram entrance"
        ],
        "timings": "08:30 AM - 12:30 PM, 05:30 PM - 07:30 PM daily",
        "best_time": "October to March (Peaceful morning heritage visit)",
        "entry_fee": "Free Admission (Protected Archaeological Shrine)",
        "elevation": "820 m above sea level",
        "distance_hint": "~9 km southwest of Tumakuru via Gulur",
        "maps_url": "https://share.google/tJcxnJJH0R7k2TL2D"
    },
    {
        "id": "siddarabetta",
        "name": "Siddara Betta (Gavi Gudi)",
        "kannada": "ಸಿದ್ಧರ ಬೆಟ್ಟ (ಗವಿ ಗುಡಿ)",
        "lat": 13.5535,
        "lng": 77.1333,
        "category": "Hill Sanctuary, Mystical Caves & Medicinal Herbs",
        "tag": "Hill of Saints",
        "image": "static/images/siddarabetta.jpg",
        "summary": "Famed as the 'Hill of Saints', Siddara Betta in Koratagere is a renowned spiritual hermitage where ascetics and siddhas performed intense dhyana in natural rock caverns. It is celebrated for its natural subterranean cave shrine dedicated to Lord Siddalingeshwara and its treasure of rare Ayurvedic medicinal flora.",
        "highlights": [
            "Ancient hermitage where revered sages and siddhas performed penance; historically known as Suvarna Giri",
            "Mystical subterranean rock-cut cave temple (Gavi Gudi) dedicated to Lord Siddalingeshwara",
            "Celebrated as 'Sasya Sanjeevini Kshethra' rich in hundreds of medicinal herbs with natural healing water springs",
            "Exhilarating hill trek with stone-cut steps winding through massive boulders, natural crevasses, and summit panoramic viewpoints"
        ],
        "timings": "06:00 AM - 06:00 PM daily",
        "best_time": "September to February (Pleasant morning cave exploration)",
        "entry_fee": "Free Admission",
        "elevation": "518 m (1,700 ft) above sea level",
        "distance_hint": "~32 km northeast of Tumakuru in Koratagere taluk",
        "maps_url": "https://share.google/5Y0uUCujow5d8F5NV"
    },
    {
        "id": "channarayanadurga",
        "name": "Channarayana Durga Fort",
        "kannada": "ಚನ್ನರಾಯನದುರ್ಗ ಕೋಟೆ",
        "lat": 13.6828,
        "lng": 77.2558,
        "category": "Navadurga Fort & Monolithic Trekking",
        "tag": "Navadurga Citadel",
        "image": "static/images/channarayanadurga.jpg",
        "summary": "One of the historic Navadurgas (nine strategic hill forts) of Tumakuru, Channarayana Durga rises to 1,188m (3,734 ft). Constructed by 17th-century Palegara chieftain Chikkappa Gouda, it features multi-tiered stone ramparts, cunning false doorways to confound invaders, and rock-hewn rainwater ponds overlooking Madhugiri.",
        "highlights": [
            "Part of the famed Navadurgas (9 historical hill citadels) of Tumakuru district",
            "Multi-tiered fortification with seven concentric stone gateways, watchtower bastions, and trick false doorways",
            "Historic stronghold bitterly contested between the Marathas, Mysore Wodeyars, and the British",
            "Adventurous granite rock climb with ancient rock-cut ponds, summit temple ruins, and 360-degree panorama of the Deccan horizon"
        ],
        "timings": "06:00 AM - 05:30 PM (Best started before 08:30 AM)",
        "best_time": "September to February (Pleasant cool winds for trekking)",
        "entry_fee": "Free Admission (Protected State Heritage Hill)",
        "elevation": "1,188 m (3,734 ft) above sea level",
        "distance_hint": "~42 km northeast of Tumakuru near Koratagere",
        "maps_url": "https://share.google/W7u6iNhL5mWlcTGif"
    }
]

CULINARY_GUIDE = {
    "pure_veg": [
        {
            "name": "Vilasi Delight",
            "kannada": "ವಿಲಾಸಿ ಡಿಲೈಟ್",
            "location": "MG Road, Tumakuru",
            "type": "Pure Veg (ಸಸ್ಯಾಹಾರಿ)",
            "tag": "Heritage Breakfast Landmark",
            "rating": 4.7,
            "cost": "₹150 for two",
            "timings": "06:30 AM - 10:30 PM",
            "specialties": ["Crispy Mysore Masala Dosa", "Tumakuru Thatte Idli with Vada", "Aromatic Filter Kaapi", "Badam Halwa"],
            "description": "An undisputed breakfast legend right on MG Road. Famous for golden ghee roast dosas, fluffy thatte idlis steeped in hot sambar, and authentic hand-pulled South Indian filter coffee.",
            "image": "static/images/vilasi_delight.jpg",
            "maps_query": "Vilasi Delight MG Road Tumakuru"
        },
        {
            "name": "Sasyapaaka",
            "kannada": "ಸಸ್ಯಪಾಕ",
            "location": "NH 48 Highway, Tumakuru Bypass",
            "type": "Pure Veg (ಸಸ್ಯಾಹಾರಿ)",
            "tag": "Satvik Highway Feast",
            "rating": 4.6,
            "cost": "₹350 for two",
            "timings": "07:00 AM - 11:00 PM",
            "specialties": ["Karnataka Jolada Rotti Meals", "Ennegayi (Stuffed Brinjal)", "Shenga Chutney Pudi", "Puran Poli / Bele Holige"],
            "description": "The quintessential pitstop on NH-48. Celebrated for pristine North and South Karnataka Satvik thalis, hot jolada rotti with desi ghee, and warm sweet holige with fresh milk.",
            "image": "static/images/sasyapaaka.jpg",
            "maps_query": "Sasyapaaka NH 48 Tumakuru"
        },
        {
            "name": "Trikal Cafe",
            "kannada": "ತ್ರಿಕಾಲ್ ಕೆಫೆ",
            "location": "Vidyanagar, Tumakuru",
            "type": "Pure Veg (ಸಸ್ಯಾಹಾರಿ)",
            "tag": "Boutique Artisan Cafe",
            "rating": 4.5,
            "cost": "₹280 for two",
            "timings": "10:00 AM - 10:30 PM",
            "specialties": ["Artisan Espresso & Hazelnut Frappe", "Cheese Herb Panini", "Crisp Peri-Peri Fries", "Signature Brownie Sundae"],
            "description": "A stylish, lively youth and traveler hub in Vidyanagar. Offers handcrafted gourmet coffee blends, artisanal sandwiches, desserts, and an aesthetic cozy atmosphere for relaxing after a hill trek.",
            "image": "static/images/trikal_cafe.jpg",
            "maps_query": "Trikal Cafe Vidyanagar Tumakuru"
        }
    ],
    "non_veg": [
        {
            "name": "NR Kitchen Nati Style Biryani",
            "kannada": "ಎನ್‌ಆರ್ ಕಿಚನ್ ನಾಟಿ ಸ್ಟೈಲ್ ಬಿರಿಯಾನಿ",
            "location": "Gangothri Road, SIT Ext / Batawadi, Tumakuru",
            "type": "Non-Veg (ಮಾಂಸಾಹಾರಿ)",
            "tag": "Dawn Biryani & Kaal Soup Cult",
            "rating": 4.8,
            "cost": "₹300 for two",
            "timings": "06:00 AM - 10:30 PM",
            "specialties": ["Nati Mutton Dum Biryani", "Thatte Idli with Mutton Kaal Soup", "Kshatriya Chicken Kabab", "Pepper Chicken & Chops"],
            "description": "Cult-favorite local hotspot in SIT Extension. Renowned for its crack-of-dawn Thatte Idli paired with piping hot mutton Kaal Soup, authentic Nati style Dum Biryani, and fiery pepper chicken.",
            "image": "static/images/nr_kitchen.jpg",
            "maps_url": "https://maps.app.goo.gl/aiTqdaQhekJ3dBqa8",
            "maps_query": "NR KITCHEN NATI STYLE BIRYANI Tumakuru"
        },
        {
            "name": "SGS Nonveg Gundu Palav",
            "kannada": "ಎಸ್‌ಜಿಎಸ್ ನಾನ್‌ವೆಜ್ ಗುಂಡು ಪಲಾವ್",
            "location": "Honnavar Highway (NH 206), Tumakuru",
            "type": "Non-Veg (ಮಾಂಸಾಹಾರಿ)",
            "tag": "Nati Style Cult Favorite",
            "rating": 4.8,
            "cost": "₹320 for two",
            "timings": "11:30 AM - 04:00 PM, 06:30 PM - 10:30 PM",
            "specialties": ["Nati Koli (Country Chicken) Gundu Palav", "Spicy Mutton Sukka", "Thale Mamsa Fry", "Boiled Egg Palav"],
            "description": "Legendary rustic Karnataka Nati style eatery on Honnavar Highway. Known for short-grain Jeera Samba rice Gundu Palav infused with fresh ground spices, tender country chicken, and rich gravy.",
            "image": "static/images/sgs_gundu_palav.jpg",
            "maps_query": "SGS Nonveg Gundu Palav Tumakuru"
        },
        {
            "name": "Sharief Bhai Biryani",
            "kannada": "ಶರೀಫ್ ಭಾಯ್ ಬಿರಿಯಾನಿ",
            "location": "Ashok Nagar / B.H. Road, Tumakuru",
            "type": "Non-Veg (ಮಾಂಸಾಹಾರಿ)",
            "tag": "Royal Dum Biryani",
            "rating": 4.6,
            "cost": "₹450 for two",
            "timings": "11:00 AM - 11:30 PM",
            "specialties": ["Gosht Dum Biryani (Mutton)", "Murgh Kalmi Kebab", "Nalli Nihari with Kulcha", "Royal Matka Phirni"],
            "description": "Authentic Dakhni and Mughlai dining destination in Tumakuru. Renowned for slow-cooked clay pot Dum Biryanis, rich bone-marrow curries, melt-in-mouth kebabs, and traditional dessert pots.",
            "image": "static/images/sharief_bhai.jpg",
            "maps_query": "Sharief Bhai Biryani Tumakuru"
        },
        {
            "name": "Olumbus Restaurant",
            "kannada": "ಓಲಂಬಸ್ ರೆಸ್ಟೋರೆಂಟ್",
            "location": "Bheemasandra, Tumakuru",
            "type": "Non-Veg (ಮಾಂಸಾಹಾರಿ)",
            "tag": "Premium Multi-Cuisine Family Dining",
            "rating": 4.5,
            "cost": "₹550 for two",
            "timings": "12:00 PM - 11:00 PM",
            "specialties": ["Tandoori Mixed Sizzler", "Butter Garlic Prawns", "Afghani Chicken Handi", "Schezwan Seafood Rice"],
            "description": "Tumakuru's top-rated multi-cuisine destination located in Bheemasandra. Features a comfortable ambient family seating area, charcoal tandoor specials, coastal seafood, and Chinese delicacies.",
            "image": "static/images/olumbus.jpg",
            "maps_query": "Olumbus Restaurant Bheemasandra Tumakuru"
        }
    ]
}

@app.route('/')
def index():
    return render_template('index.html', destinations=DESTINATIONS, culinary=CULINARY_GUIDE)

@app.route('/api/destinations')
def get_destinations():
    return jsonify(DESTINATIONS)

@app.route('/api/feedback', methods=['GET', 'POST'])
def feedback_api():
    if request.method == 'POST':
        data = request.get_json(silent=True) or request.form
        name = data.get('name', '').strip()
        try:
            rating = int(data.get('rating', 0))
        except (ValueError, TypeError):
            return jsonify({'success': False, 'message': 'Rating must be an integer between 1 and 5.'}), 400
        
        comment = data.get('comment', '').strip()
        destination = data.get('destination', 'Heritage Circuit').strip() or 'Heritage Circuit'
        
        if not name:
            return jsonify({'success': False, 'message': 'Name cannot be blank.'}), 400
        if rating < 1 or rating > 5:
            return jsonify({'success': False, 'message': 'Rating must be between 1 and 5 stars.'}), 400
        if not comment:
            return jsonify({'success': False, 'message': 'Please share your thoughts or review comment.'}), 400
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute('''
            INSERT INTO feedback (name, rating, comment, destination, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, rating, comment, destination, created_at))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Thank you! Your feedback has been saved and is now live.',
            'entry': {
                'id': new_id,
                'name': name,
                'rating': rating,
                'comment': comment,
                'destination': destination,
                'created_at': created_at
            }
        })

    # GET request - return all reviews sorted latest first
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, rating, comment, destination, created_at FROM feedback ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    entries = []
    total_rating = 0
    for r in rows:
        entries.append({
            'id': r[0],
            'name': r[1],
            'rating': r[2],
            'comment': r[3],
            'destination': r[4],
            'created_at': r[5]
        })
        total_rating += r[2]
        
    avg_rating = round(total_rating / len(entries), 1) if entries else 5.0
    
    return jsonify({
        'total': len(entries),
        'avg_rating': avg_rating,
        'entries': entries
    })

if __name__ == '__main__':
    init_db()
    print("TumkurTrot Flask Server starting on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
