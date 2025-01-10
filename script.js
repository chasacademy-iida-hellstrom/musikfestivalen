const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");
const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist&include=3`;

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP-fel! Statuskod: ${response.status}`);
  }
  return response.json();
};

const findRelation = (entries, id, field = "name") => {
  const entry = entries.find((entry) => entry.sys.id === id);
  return entry ? entry.fields[field] || "Ingen info" : "Ingen info";
};

const artistImages = {
  "3EaJyvMEJZn0SEujFTAfhh": "images/ariana.jpg",
  "3h10Md9vCJztB4LVWq4SZw": "images/weeknd.jpg",
  "3dfDAlSCyLOEMjnLYRHDW3": "images/travis.jpg",
  "6uOdMg1FwV2X0XzMbsRTqI": "images/snarky.jpg",
  "4Jg8p2V4BRWHUWpMJTmLVb": "images/imagine.png",
  "3POGTLp40vViwu3PYg4ZQs": "images/lumineers.jpg",
  "1s4kb4NRwcIxXtH43ZwG2a": "images/Drake.jpg",
  "2y2H4WReTkLEuIsXb8TuV2": "images/billie.jpg",
  "1kYPDZKvt1jknL0g37RDnJ": "images/slipknot.jpg",
  "1m6BKmWSVKkcanEncErKQv": "images/metallica.jpg",
};

const createArtistHTML = (artist, data) => {
  if (!artist.fields) {
    console.error("Artist saknar fält:", artist);
    return "";
  }

  const genre = findRelation(data.includes.Entry, artist.fields.genre?.sys.id);
  const stage = findRelation(data.includes.Entry, artist.fields.stage?.sys.id);
  const dayDescription = findRelation(
    data.includes.Entry,
    artist.fields.day?.sys.id,
    "description"
  );

  const imageUrl = artistImages[artist.sys.id] || "images/default.jpg";

  return `
    <div class="artist-card">
      <img src="${imageUrl}" alt="Bild på ${artist.fields.name}" class="artist-image">
      <h3>${artist.fields.name}</h3>
      <p><strong>Genre:</strong> ${genre}</p>
      <p><strong>Scen:</strong> ${stage}</p>
      <p><strong>Dag:</strong> ${dayDescription}</p>
      <p>${artist.fields.description}</p>
    </div>
  `;
};

const renderArtists = (data) => {
  console.log("Renderar artister med data:", data);
  const postContainer = document.getElementById("posts-container");
  if (!postContainer) {
    throw new Error('Elementet med id "posts-container" hittades inte i DOM.');
  }

  const postHTML = data.items
    .map((artist) => createArtistHTML(artist, data))
    .join("");
  postContainer.classList.add("artist-grid");
  postContainer.innerHTML = postHTML;
};

const init = async () => {
  try {
    const data = await fetchData(apiURL);
    renderArtists(data);
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }
};

init();
