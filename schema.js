const baseUrl = "https://cdn.contentful.com/spaces/";

const SPACE_ID = localStorage.getItem("space_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");

const apiURL = `${baseUrl}${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist&include=3`;

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

        return {
          name: artist.fields.name,
          genre: genre ? genre.fields.name : "Ingen genre",
          stage: stage ? stage.fields.name : "Ingen scen",
          day: dayName,
          date: date,
          description: artist.fields.description,
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

    ["Friday", "Saturday", "Sunday"].forEach((day) => {
      if (groupedByDay[day]) {
        const date = groupedByDay[day].date || "Inget datum";
        postHTML += `<button class="day-button" data-day="${day.toLowerCase()}">${day} <br> ${date}</button>`;
      }
    });

    postHTML += `</div>`;

    Object.keys(groupedByDay).forEach((day) => {
      const date = groupedByDay[day].date || "Inget datum";
      postHTML += `<div class="day-section" id="${day.toLowerCase()}" style="display: none;">
                <h2><span class="day-name">${day}</span> <span class="day-date">${date}</span></h2>
                <div class="artist-cards">`;

      groupedByDay[day].artists.forEach((artist) => {
        postHTML += `
                    <div class="artist-card">
                        <h3>${artist.name}</h3>
                        <p><strong>Genre:</strong> ${artist.genre}</p>
                        <p><strong>Scen:</strong> ${artist.stage}</p>
                    </div>`;
      });

      postHTML += `</div></div>`;
    });

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
