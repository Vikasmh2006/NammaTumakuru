/**
 * TUMKURTROT - CLIENT CONTROLLER & GEOLOCATION DISTANCE ENGINE
 * Core Features:
 * - Geolocation API & Precise Haversine Distance Calculator
 * - Individual Destination Modal Manager
 * - Culinary Guide Tab Toggle
 * - Interactive 5-Star Rating Feedback System
 * - Live Stream Database Sync & Toast Notifications
 */

// Destination Master Registry with exact coordinates
const DESTINATIONS_DATA = {
  "siddaganga": {
    name: "Sree Siddaganga Mutt",
    kannada: "ಶ್ರೀ ಸಿದ್ಧಗಂಗಾ ಮಠ",
    lat: 13.3221,
    lng: 77.1264,
    category: "Spiritual Legacy & Social Service",
    tag: "Spiritual Center",
    image: "static/images/siddaganga.jpg",
    summary: "Founded in the 15th century, Siddaganga Mutt is a monumental pilgrimage and philanthropic center renowned worldwide for providing free food ('Dasoha'), shelter, and education to over 10,000 underprivileged children daily.",
    highlights: [
      "Centuries-old educational legacy nurtured by the revered 'Walking God' Dr. Sree Sree Shivakumara Swamiji",
      "Continuous Trividha Dasoha (free Anna, Akshara, and Ashraya) serving thousands daily",
      "Spectacular annual agricultural fair and January Jatra Mahotsava drawing millions of devotees",
      "Ancient hill-slope shrine dedicated to Siddhalingeshwara and historical Kalyani stepwell"
    ],
    timings: "06:00 AM - 08:30 PM daily",
    bestTime: "October to March (Special during January Jatra)",
    entryFee: "Free Admission (Dasoha is open to all visitors)",
    elevation: "850 m above sea level"
  },
  "devarayanadurga": {
    name: "Devarayanadurga",
    kannada: "ದೇವರಾಯನದುರ್ಗ",
    lat: 13.3734,
    lng: 77.2111,
    category: "Hill Station & Sacred Temples",
    tag: "Hill Sanctuary",
    image: "static/images/devarayanadurga.jpg",
    summary: "A tranquil hill station nestled in rocky crags and dry deciduous forest at 1,188m elevation. It houses the famed twin shrines: Bhoga Narasimha at the base and Yoga Narasimha on the scenic cliff summit.",
    highlights: [
      "Twin sacred shrines: Sri Bhoga Narasimha Swamy (foothills) and Sri Yoga Narasimha Swamy (hilltop)",
      "Traditional Temple Car Festivals (Brahmarathotsava) celebrated with grand wooden chariots and rural vibrancy",
      "Kalyana Teertha holy spring and vantage viewpoints offering panoramic views of Tumakuru district",
      "Rich flora and fauna harboring leopard habitats and rare medicinal herbs"
    ],
    timings: "08:00 AM - 06:30 PM",
    bestTime: "July to February (Pleasant monsoon and winter mist)",
    entryFee: "Free (Temple Darshan); Nominal hill road vehicle toll",
    elevation: "1,188 m above sea level"
  },
  "madhugiri": {
    name: "Madhugiri Fort",
    kannada: "ಮಧುಗಿರಿ ಬೆಟ್ಟ ಮತ್ತು ಕೋಟೆ",
    lat: 13.6644,
    lng: 77.2078,
    category: "Monolithic Wonder & Historical Trekking",
    tag: "Asia's Monolith",
    image: "static/images/madhugiri.jpg",
    summary: "Standing atop one of Asia’s largest monoliths (1,200m), Madhugiri Fort is a masterwork of military engineering constructed by the Vijayanagara chieftains and enhanced by Hyder Ali and Tipu Sultan with historic stone paths.",
    highlights: [
      "Perched atop the second largest monolithic rock hill in Asia with breathtaking steep granite slopes",
      "Formidable multi-tiered defensive fortification with Antaralada Bagilu (internal gates) and bastions",
      "Steep historic stone-cut steps with safety iron railings providing a world-class adventure trek",
      "Summit ruins of the Gopalakrishna temple and historic granaries overlooking the Deccan plains"
    ],
    timings: "06:00 AM - 05:30 PM (Trek starts best before 08:30 AM)",
    bestTime: "September to February (Avoid peak midday summer sun)",
    entryFee: "Free Admission (Protected ASI / State Monument)",
    elevation: "1,200 m above sea level"
  },
  "namadachilume": {
    name: "Namada Chilume",
    kannada: "ನಾಮದ ಚಿಲುಮೆ",
    lat: 13.3642,
    lng: 77.1947,
    category: "Eco-Tourism & Mythological Spring",
    tag: "Perennial Spring",
    image: "static/images/namadachilume.jpg",
    summary: "A peaceful natural spring nestled deep within the Devarayanadurga reserve forest and deer park. Legend holds that Lord Rama made this fissure in the rock with his arrow to apply his 'Nama' (tilak) during his Vanavasa exile.",
    highlights: [
      "Perennial natural freshwater spring that never runs dry, continuously welling up through a rocky cleft",
      "Surrounded by a dense green deer park sanctuary with spotted chital deer roaming peacefully",
      "Forested walking trails under canopies of teak, eucalyptus, and wild forest groves",
      "Ideal picnic and bird-watching destination popular among families and eco-travelers"
    ],
    timings: "09:00 AM - 05:30 PM daily",
    bestTime: "Round the year (Lush post-monsoon greenery)",
    entryFee: "₹10 per adult; ₹5 per child (Forest Dept maintenance)",
    elevation: "890 m above sea level"
  },
  "mandaragiri": {
    name: "Mandaragiri Jain Temple",
    kannada: "ಮಂದಾರಗಿರಿ ಬೆಟ್ಟ (ಬಸದಿ ಬೆಟ್ಟ)",
    lat: 13.2547,
    lng: 77.1752,
    category: "Jain Heritage & Architectural Wonder",
    tag: "Pinchi Dome Icon",
    image: "static/images/mandaragiri.jpg",
    summary: "Popularly called Basadi Betta, this Jain heritage hill is globally famous for its unique 81-foot peacock-feather-shaped Pinchi dome (Guru Mandir) and the monolithic statue of Bhagwan Chandranatha overlooking serene Mydala Lake.",
    highlights: [
      "World-famous 81-foot peacock-feather-shaped Pinchi dome architecture symbolizing non-violence and asceticism",
      "Easy 435-step climb up smooth granite rock suitable for travelers of all ages",
      "Four historic 12th-century Hoysala and Vijayanagara era Digambara Jain basadis atop the rock",
      "Pristine Mydala Lake reflecting the hills and blue Karnataka skies right behind the complex"
    ],
    timings: "06:30 AM - 07:00 PM daily",
    bestTime: "October to March (Sunset at Mydala lake is unmissable)",
    entryFee: "Free Admission",
    elevation: "840 m above sea level"
  },
  "goravanahalli": {
    name: "Goravanahalli Mahalakshmi Temple",
    kannada: "ಗೊರವನಹಳ್ಳಿ ಮಹಾಲಕ್ಷ್ಮೀ ದೇವಸ್ಥಾನ",
    lat: 13.4883,
    lng: 77.2625,
    category: "Sacred Pilgrimage & Divine Blessings",
    tag: "Revered Goddess Shrine",
    image: "static/images/goravanahalli.jpg",
    summary: "One of the most revered Shakti shrines in Karnataka, dedicated to Goddess Mahalakshmi. Devotees from across southern India arrive to seek blessings for prosperity, peace, and auspicious beginnings.",
    highlights: [
      "Svayambhu (self-manifested) idol of Goddess Mahalakshmi radiating divine poise and grace",
      "Deep historical tradition initiated by Kamalamma who discovered and revived the deity's worship",
      "Free Annadana (sacred midday feast) served to all devotees and travelers visiting the temple",
      "Scenic location adjacent to the Theetha water reservoir offering cool evening breezes"
    ],
    timings: "06:00 AM - 12:30 PM, 05:30 PM - 08:30 PM (Extended on Fridays & Tuesdays)",
    bestTime: "All year round (Special festivities during Navaratri and Deepavali)",
    entryFee: "Free General Darshan; Special Seva tickets available",
    elevation: "790 m above sea level"
  },
  "shivagange": {
    name: "Shivagange",
    kannada: "ಶಿವಗಂಗೆ ಬೆಟ್ಟ",
    lat: 13.1704,
    lng: 77.2245,
    category: "Dakshina Kashi & Cave Temples",
    tag: "Sacred Shivalinga Peak",
    image: "static/images/shivagange.jpg",
    summary: "Hailed as the 'Dakshina Kashi' (Kashi of the South), Shivagange is a sacred conical mountain peak shaped like a Shivalinga with rock-cut cave temples dedicated to Gangadhareshwara and Honnadevi, and a natural spring springing from the rocks.",
    highlights: [
      "Sacred mountain peak towering at 1,368 meters, shaped naturally like a mammoth Shiva Linga",
      "Mystical Gangadhareshwara Cave Temple where ghee offered to the linga miraculously turns into medicinal butter",
      "Olakkal Teertha spring deep inside narrow natural rock crevices and the thrilling Nandi carved at the summit precipice",
      "Ancient stone pathways flanked with carved stone mandapas dating back to the Hoysala dynasty"
    ],
    timings: "06:00 AM - 06:00 PM daily",
    bestTime: "October to March (Cool breezes and clear panorama)",
    entryFee: "Free Admission",
    elevation: "1,368 m above sea level"
  },
  "kaidala": {
    name: "Kaidala Shri Chennakeshava Swamy Temple",
    kannada: "ಕೈದಾಳ ಶ್ರೀ ಚೆನ್ನಕೇಶವ ಸ್ವಾಮಿ ದೇವಾಲಯ",
    lat: 13.3150,
    lng: 77.0392,
    category: "Hoysala Architecture & Master Sculptor Heritage",
    tag: "Amarashilpi Jakanachari Heritage",
    image: "static/images/kaidala.jpg",
    summary: "Birthplace and redemption sanctuary of Karnataka's legendary master sculptor Amarashilpi Jakanachari. Commissioned in 1150 AD during the Hoysala era, this historic Dravidian-Hoysala temple houses an exquisite 5.5-foot monolith idol of Lord Chennakeshava carved from dark soapstone (Krishna Shile), intricately carved with the Dashavatara.",
    highlights: [
      "Legendary birthplace of master sculptor Amarashilpi Jakanachari, creator of Belur and Halebidu masterpieces",
      "Miraculous hand restoration: Jakanachari regained his severed right hand here after sculpting Chennakeshava, naming the town 'Kai-dala'",
      "Rare west-facing 5.5-foot monolith idol of Lord Chennakeshava carved with microscopic precision from dark Krishna Shile soapstone",
      "Historic 1150 AD Hoysala inscription commissioned by chieftain Samanta Bachi under King Narasimha I",
      "Massive stone compound prakara walls and ornate Vijayanagara-era Rajagopuram entrance"
    ],
    timings: "08:30 AM - 12:30 PM, 05:30 PM - 07:30 PM daily",
    bestTime: "October to March (Peaceful morning heritage visit)",
    entryFee: "Free Admission (Protected Archaeological Shrine)",
    elevation: "820 m above sea level",
    maps_url: "https://share.google/tJcxnJJH0R7k2TL2D"
  },
  "siddarabetta": {
    name: "Siddara Betta (Gavi Gudi)",
    kannada: "ಸಿದ್ಧರ ಬೆಟ್ಟ (ಗವಿ ಗುಡಿ)",
    lat: 13.5535,
    lng: 77.1333,
    category: "Hill Sanctuary, Mystical Caves & Medicinal Herbs",
    tag: "Hill of Saints",
    image: "static/images/siddarabetta.jpg",
    summary: "Famed as the 'Hill of Saints', Siddara Betta in Koratagere is a renowned spiritual hermitage where ascetics and siddhas performed intense dhyana in natural rock caverns. It is celebrated for its natural subterranean cave shrine dedicated to Lord Siddalingeshwara and its treasure of rare Ayurvedic medicinal flora.",
    highlights: [
      "Ancient hermitage where revered sages and siddhas performed penance; historically known as Suvarna Giri",
      "Mystical subterranean rock-cut cave temple (Gavi Gudi) dedicated to Lord Siddalingeshwara",
      "Celebrated as 'Sasya Sanjeevini Kshethra' rich in hundreds of medicinal herbs with natural healing water springs",
      "Exhilarating hill trek with stone-cut steps winding through massive boulders, natural crevasses, and summit panoramic viewpoints"
    ],
    timings: "06:00 AM - 06:00 PM daily",
    bestTime: "September to February (Pleasant morning cave exploration)",
    entryFee: "Free Admission",
    elevation: "518 m (1,700 ft) above sea level",
    maps_url: "https://share.google/5Y0uUCujow5d8F5NV"
  },
  "channarayanadurga": {
    name: "Channarayana Durga Fort",
    kannada: "ಚನ್ನರಾಯನದುರ್ಗ ಕೋಟೆ",
    lat: 13.6828,
    lng: 77.2558,
    category: "Navadurga Fort & Monolithic Trekking",
    tag: "Navadurga Citadel",
    image: "static/images/channarayanadurga.jpg",
    summary: "One of the historic Navadurgas (nine strategic hill forts) of Tumakuru, Channarayana Durga rises to 1,188m (3,734 ft). Constructed by 17th-century Palegara chieftain Chikkappa Gouda, it features multi-tiered stone ramparts, cunning false doorways to confound invaders, and rock-hewn rainwater ponds overlooking Madhugiri.",
    highlights: [
      "Part of the famed Navadurgas (9 historical hill citadels) of Tumakuru district",
      "Multi-tiered fortification with seven concentric stone gateways, watchtower bastions, and trick false doorways",
      "Historic stronghold bitterly contested between the Marathas, Mysore Wodeyars, and the British",
      "Adventurous granite rock climb with ancient rock-cut ponds, summit temple ruins, and 360-degree panorama of the Deccan horizon"
    ],
    timings: "06:00 AM - 05:30 PM (Best started before 08:30 AM)",
    bestTime: "September to February (Pleasant cool winds for trekking)",
    entryFee: "Free Admission (Protected State Heritage Hill)",
    elevation: "1,188 m (3,734 ft) above sea level",
    maps_url: "https://share.google/W7u6iNhL5mWlcTGif"
  }
};

// Current active coordinates state (Defaulting to Tumakuru City Center: 13.3409, 77.1010)
let userLocation = {
  lat: 13.3409,
  lng: 77.1010,
  label: "Tumakuru City Center (KSRTC Central)",
  isLiveGps: false
};

// Star rating active state for feedback form
let selectedRating = 5;

// ===================================================================
// 3. LIVE DISTANCE TRACKER LOGIC (HAVERSINE FORMULA)
// ===================================================================

/**
 * Compute the great-circle distance between two points on Earth using Haversine formula
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance into human-friendly representation with drive estimation
 */
function formatDistance(distKm) {
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)} m away`;
  }
  const kmFormatted = distKm.toFixed(1);
  // Estimate driving time assuming average speed of ~45 km/h on regional roads
  const driveHours = distKm / 45;
  let timeStr = "";
  if (driveHours < 1) {
    timeStr = `~${Math.max(5, Math.round(driveHours * 60))} mins drive`;
  } else {
    const hrs = Math.floor(driveHours);
    const mins = Math.round((driveHours - hrs) * 60);
    timeStr = `~${hrs}h ${mins > 0 ? mins + 'm' : ''} drive`;
  }
  return `${kmFormatted} km (${timeStr})`;
}

/**
 * Refresh distance displays across all destination cards and active modal
 */
function updateAllDistances() {
  // Update dock status text
  const coordsDisplay = document.getElementById("activeCoordsDisplay");
  if (coordsDisplay) {
    coordsDisplay.textContent = `${userLocation.label} [${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E]`;
  }

  // Update cards
  Object.keys(DESTINATIONS_DATA).forEach(destId => {
    const dest = DESTINATIONS_DATA[destId];
    const dist = haversineDistance(userLocation.lat, userLocation.lng, dest.lat, dest.lng);

    const badge = document.getElementById(`distance-badge-${destId}`);
    if (badge) {
      badge.innerHTML = `<i class="icon-location">📍</i> ${dist.toFixed(1)} km`;
      badge.title = `Computed from ${userLocation.label}: ${formatDistance(dist)}`;
    }
  });

  // If a modal is currently open, update its distance box
  const activeModalDestId = document.getElementById("destinationModal")?.dataset?.currentDestId;
  if (activeModalDestId && DESTINATIONS_DATA[activeModalDestId]) {
    updateModalDistanceBox(activeModalDestId);
  }
}

/**
 * Trigger browser Geolocation API
 */
function detectBrowserLocation() {
  const btn = document.getElementById("btnDetectGps");
  const navBtn = document.getElementById("navGpsBtn");

  if (btn) btn.innerHTML = "<span>⏳ Locating...</span>";
  if (navBtn) navBtn.innerHTML = "<span class='pulse-dot'></span> Locating...";

  if (!navigator.geolocation) {
    showToast("Geolocation is not supported by your browser. Using simulated city presets.", "warning");
    resetGpsBtn();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      userLocation.lat = position.coords.latitude;
      userLocation.lng = position.coords.longitude;
      userLocation.label = "Your Live GPS Location";
      userLocation.isLiveGps = true;

      // Sync city dropdown to custom/live
      const citySelect = document.getElementById("gpsCitySelect");
      if (citySelect) {
        citySelect.value = "live_gps";
      }

      updateAllDistances();
      showToast(`📍 Live GPS locked: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}! All distances updated.`, "success");
      resetGpsBtn();
    },
    error => {
      console.warn("Geolocation permission or error:", error);
      let errorMsg = "Unable to fetch GPS. Defaulting to Tumakuru City Center.";
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = "Location access was denied. You can select an origin city from the dropdown.";
      }
      showToast(errorMsg, "info");
      resetGpsBtn();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function resetGpsBtn() {
  const btn = document.getElementById("btnDetectGps");
  const navBtn = document.getElementById("navGpsBtn");
  if (btn) btn.innerHTML = "<i class='icon-radar'>📡</i> Detect My GPS";
  if (navBtn) navBtn.innerHTML = "<span class='pulse-dot'></span> GPS Tracker";
}

/**
 * Handle manual origin selection from dropdown
 */
function handleOriginCityChange(selectEl) {
  const val = selectEl.value;
  switch (val) {
    case "tumkur_center":
      userLocation = { lat: 13.3409, lng: 77.1010, label: "Tumakuru KSRTC Central", isLiveGps: false };
      break;
    case "bangalore_majestic":
      userLocation = { lat: 12.9767, lng: 77.5713, label: "Bengaluru Majestic (KBS)", isLiveGps: false };
      break;
    case "bangalore_airport":
      userLocation = { lat: 13.1986, lng: 77.7066, label: "Bengaluru Intl Airport (BLR)", isLiveGps: false };
      break;
    case "mysuru_palace":
      userLocation = { lat: 12.3052, lng: 76.6552, label: "Mysuru Palace", isLiveGps: false };
      break;
    case "live_gps":
      detectBrowserLocation();
      return;
    default:
      userLocation = { lat: 13.3409, lng: 77.1010, label: "Tumakuru City Center", isLiveGps: false };
  }
  updateAllDistances();
  showToast(`Origin set to ${userLocation.label}. Distances recalculated.`, "info");
}

// ===================================================================
// 2. MODAL VIEW WINDOWS FOR HERITAGE CIRCUIT
// ===================================================================

function openDestinationModal(destId) {
  const dest = DESTINATIONS_DATA[destId];
  if (!dest) return;

  const modal = document.getElementById("destinationModal");
  if (!modal) return;

  modal.dataset.currentDestId = destId;

  // Populate content
  document.getElementById("modalHeroImg").src = dest.image;
  document.getElementById("modalHeroImg").alt = dest.name;
  document.getElementById("modalTag").textContent = dest.tag;
  document.getElementById("modalTitle").textContent = dest.name;
  document.getElementById("modalKannada").textContent = dest.kannada;
  document.getElementById("modalDescription").textContent = dest.summary;

  document.getElementById("modalTimings").textContent = dest.timings;
  document.getElementById("modalBestTime").textContent = dest.bestTime;
  document.getElementById("modalEntryFee").textContent = dest.entryFee;
  document.getElementById("modalElevation").textContent = dest.elevation;

  // Highlights list
  const hlList = document.getElementById("modalHighlightsList");
  hlList.innerHTML = "";
  dest.highlights.forEach(hl => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>★</strong> <span>${hl}</span>`;
    hlList.appendChild(li);
  });

  // Google Maps navigation URL
  const gmapsLink = document.getElementById("modalMapsLink");
  if (gmapsLink) {
    gmapsLink.href = dest.maps_url || `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
  }

  // Update distance box inside modal
  updateModalDistanceBox(destId);

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateModalDistanceBox(destId) {
  const dest = DESTINATIONS_DATA[destId];
  if (!dest) return;

  const dist = haversineDistance(userLocation.lat, userLocation.lng, dest.lat, dest.lng);
  const distEl = document.getElementById("modalDistanceValue");
  const originEl = document.getElementById("modalDistanceOrigin");

  if (distEl) distEl.textContent = `${dist.toFixed(1)} km`;
  if (originEl) {
    originEl.textContent = `Distance calculated via Haversine formula from ${userLocation.label} (${formatDistance(dist)})`;
  }
}

function closeDestinationModal() {
  const modal = document.getElementById("destinationModal");
  if (modal) {
    modal.classList.remove("active");
    modal.dataset.currentDestId = "";
    document.body.style.overflow = "";
  }
}

// ===================================================================
// 4. CULINARY GUIDE TAB TOGGLE
// ===================================================================

function switchCulinaryTab(type) {
  const vegTabBtn = document.getElementById("tabBtnVeg");
  const nonVegTabBtn = document.getElementById("tabBtnNonVeg");
  const vegPane = document.getElementById("panePureVeg");
  const nonVegPane = document.getElementById("paneNonVeg");

  if (type === "veg") {
    vegTabBtn.classList.add("active", "veg-tab");
    nonVegTabBtn.classList.remove("active", "nonveg-tab");
    vegPane.classList.add("active");
    nonVegPane.classList.remove("active");
  } else {
    nonVegTabBtn.classList.add("active", "nonveg-tab");
    vegTabBtn.classList.remove("active", "veg-tab");
    nonVegPane.classList.add("active");
    vegPane.classList.remove("active");
  }
}

// ===================================================================
// 5. USER FEEDBACK BACKEND & LIVE STREAM
// ===================================================================

function initStarRating() {
  const stars = document.querySelectorAll(".star-choice");
  const ratingText = document.getElementById("ratingDisplayLabel");
  const ratingInput = document.getElementById("feedbackRatingInput");

  const ratingDescriptions = {
    1: "1 Star - Needs Improvement",
    2: "2 Stars - Fair Experience",
    3: "3 Stars - Good & Enjoyable",
    4: "4 Stars - Very Impressive!",
    5: "5 Stars - Outstanding Heritage!"
  };

  stars.forEach(star => {
    star.addEventListener("mouseenter", () => {
      const val = parseInt(star.dataset.star, 10);
      stars.forEach(s => {
        const sVal = parseInt(s.dataset.star, 10);
        if (sVal <= val) {
          s.classList.add("hovered");
        } else {
          s.classList.remove("hovered");
        }
      });
      if (ratingText) ratingText.textContent = ratingDescriptions[val];
    });

    star.addEventListener("mouseleave", () => {
      stars.forEach(s => s.classList.remove("hovered"));
      if (ratingText) ratingText.textContent = ratingDescriptions[selectedRating];
    });

    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.star, 10);
      if (ratingInput) ratingInput.value = selectedRating;
      renderSelectedStars();
      if (ratingText) ratingText.textContent = ratingDescriptions[selectedRating];
    });
  });

  renderSelectedStars();
}

function renderSelectedStars() {
  const stars = document.querySelectorAll(".star-choice");
  stars.forEach(s => {
    const val = parseInt(s.dataset.star, 10);
    if (val <= selectedRating) {
      s.classList.add("selected");
    } else {
      s.classList.remove("selected");
    }
  });
}

/**
 * Handle feedback submission via asynchronous POST
 */
async function handleFeedbackSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById("btnSubmitFeedback");

  const name = document.getElementById("feedbackName").value.trim();
  const destination = document.getElementById("feedbackDestination").value;
  const comment = document.getElementById("feedbackComment").value.trim();
  const rating = selectedRating;

  if (!name || !comment) {
    showToast("Please fill in both your name and review comment.", "warning");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = "<span>Submitting Review...</span>";

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, rating, comment, destination })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      showToast("✨ " + data.message, "success");
      form.reset();
      selectedRating = 5;
      renderSelectedStars();
      document.getElementById("ratingDisplayLabel").textContent = "5 Stars - Outstanding Heritage!";
      // Prepend immediately to live stream and refresh stats
      loadFeedbackStream();
    } else {
      showToast(data.message || "Failed to submit feedback.", "warning");
    }
  } catch (err) {
    console.error("Feedback submit error:", err);
    showToast("Network error submitting feedback. Please verify Flask server is running.", "warning");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = "<span>Publish Review to Live Stream</span> <i>→</i>";
  }
}

/**
 * Fetch and render the persistent SQLite reviews in the live stream
 */
async function loadFeedbackStream() {
  const feedContainer = document.getElementById("feedbackLiveFeed");
  const overallScoreEl = document.getElementById("streamAvgScore");
  const totalCountEl = document.getElementById("streamTotalCount");
  if (!feedContainer) return;

  try {
    const res = await fetch("/api/feedback");
    if (!res.ok) throw new Error("Status " + res.status);
    const data = await res.json();

    if (overallScoreEl) overallScoreEl.textContent = data.avg_rating.toFixed(1);
    if (totalCountEl) totalCountEl.textContent = `Based on ${data.total} verified traveler reviews`;

    if (!data.entries || data.entries.length === 0) {
      feedContainer.innerHTML = "<p class='no-feed-text'>No reviews recorded yet. Be the first to share your experience!</p>";
      return;
    }

    feedContainer.innerHTML = "";
    data.entries.forEach(item => {
      const starsString = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);
      const initials = item.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase() || "T";

      const itemEl = document.createElement("div");
      itemEl.className = "stream-item";
      itemEl.innerHTML = `
        <div class="stream-user-meta">
          <div class="stream-author-group">
            <div class="author-avatar">${initials}</div>
            <div>
              <div class="author-name">${escapeHtml(item.name)}</div>
              <span class="stream-destination-tag">${escapeHtml(item.destination || "Heritage Circuit")}</span>
            </div>
          </div>
          <div class="stream-stars" title="${item.rating} Stars">${starsString}</div>
        </div>
        <p class="stream-comment-text">"${escapeHtml(item.comment)}"</p>
        <span class="stream-timestamp">Posted on ${item.created_at}</span>
      `;
      feedContainer.appendChild(itemEl);
    });
  } catch (err) {
    console.error("Error loading feedback stream:", err);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, match => {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
}

// ===================================================================
// TOAST NOTIFICATIONS
// ===================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

// ===================================================================
// INITIALIZATION
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll spy styling
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // Calculate default distances from Tumakuru Central
  updateAllDistances();

  // Try auto-detecting geolocation gracefully if user allows
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLocation.lat = position.coords.latitude;
        userLocation.lng = position.coords.longitude;
        userLocation.label = "Your Browser GPS Coordinates";
        userLocation.isLiveGps = true;
        const citySelect = document.getElementById("gpsCitySelect");
        if (citySelect) citySelect.value = "live_gps";
        updateAllDistances();
      },
      () => {
        // Silently keep default Tumakuru center
      },
      { timeout: 4000 }
    );
  }

  // Initialize star rating logic
  initStarRating();

  // Load reviews live stream from SQLite
  loadFeedbackStream();

  // Attach feedback form handler
  const form = document.getElementById("feedbackForm");
  if (form) {
    form.addEventListener("submit", handleFeedbackSubmit);
  }

  // Modal ESC key listener
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeDestinationModal();
    }
  });

  // Modal backdrop click listener
  const modalOverlay = document.getElementById("destinationModal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", e => {
      if (e.target === modalOverlay) {
        closeDestinationModal();
      }
    });
  }
});
