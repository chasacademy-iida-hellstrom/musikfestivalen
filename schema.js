const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");

const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist&include=3`;

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

const fetchData = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error(`HTTP-fel! Statuskod: ${response.status}`);
    }

    const data = await response.json();
    const postContainer = document.getElementById("posts-container");

    if (!postContainer) {
      throw new Error(
        'Elementet med id "posts-container" hittades inte i DOM.'
      );
    }

    const artists = data.items
      .map((artist) => {
        if (!artist.fields) {
          console.error("Artist saknar fält:", artist);
          return null;
        }

        const genre = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.genre?.sys.id
        );
        const stage = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.stage?.sys.id
        );
        const day = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.day?.sys.id
        );
        const dayName = day ? day.fields.description : "Ingen dag";

        const dateEntry = data.includes.Entry.find(
          (entry) => entry.sys.id === artist.fields.day?.sys.id
        );
        const date =
          dateEntry && dateEntry.fields.date
            ? new Date(dateEntry.fields.date).toLocaleDateString("sv-SE")
            : "Inget datum";

        const imageUrl = artistImages[artist.sys.id] || "images/default.jpg";

        return {
          name: artist.fields.name,
          genre: genre ? genre.fields.name : "Ingen genre",
          stage: stage ? stage.fields.name : "Ingen scen",
          day: dayName,
          date: date,
          description: artist.fields.description,
          imageUrl: imageUrl,
        };
      })
      .filter((artist) => artist !== null);

    const groupedByDay = artists.reduce((acc, artist) => {
      if (!acc[artist.day]) {
        acc[artist.day] = { date: null, artists: [] };
      }

      const date = acc[artist.day].date || artist.date;
      acc[artist.day] = { date, artists: [...acc[artist.day].artists, artist] };
      return acc;
    }, {});

    let postHTML = `<div class="day-buttons">`;

    postHTML += ["Friday", "Saturday", "Sunday"]
      .map((day) => {
        if (groupedByDay[day]) {
          const date = groupedByDay[day].date || "Inget datum";
          return `<button class="day-button" data-day="${day.toLowerCase()}">${day} <br> ${date}</button>`;
        }
        return "";
      })
      .join("");
    postHTML += `</div>`;

    postHTML += Object.keys(groupedByDay)
      .map((day) => {
        const date = groupedByDay[day].date || "Inget datum";
        return `
          <div class="day-section" id="${day.toLowerCase()}" style="display: none;">
            <h2><span class="day-name">${day}</span> <span class="day-date">${date}</span></h2>
            <div class="artist-cards">
              ${groupedByDay[day].artists
                .map((artist) => {
                  return `
                    <div class="artist-card">
                        <img src="${artist.imageUrl}" alt="${artist.name}" class="artist-image-custom" />
                        <h3>${artist.name}</h3>
                        <p><strong>Genre:</strong> ${artist.genre}</p>
                        <p><strong>Scen:</strong> ${artist.stage}</p>
                    </div>`;
                })
                .join("")}
            </div>
          </div>`;
      })
      .join("");

    postContainer.innerHTML = postHTML;

    const buttons = document.querySelectorAll(".day-button");
    const sections = document.querySelectorAll(".day-section");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const day = button.getAttribute("data-day");

        sections.forEach((section) => (section.style.display = "none"));

        const selectedSection = document.getElementById(day);
        if (selectedSection) {
          selectedSection.style.display = "block";
        }
      });
    });
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }
};

fetchData();
