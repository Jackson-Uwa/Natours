const stripe = window.Stripe(
  "pk_test_51LLoYxCbWCyNd5x6C1yLQvweR4jlqUrA569XoccuGkuiwJ37ibgSCk3TzMcNh2DIvm0lxgTMnJahhCWyFxgqzo3A00a2piXi01",
  { locale: "fr" }
);

const bookBtn = document.getElementById("book-tour");
if (bookBtn) {
  bookBtn.addEventListener("click", (event) => {
    event.target.textContent = "Processing...";
    const { tourId } = event.target.dataset;
    // const tourId = event.target.dataset.tourId;
    console.log(tourId);
    bookTour(tourId);
  });
}

const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert("error", err);
  }
};

// document.getElementById('map').insertAdjacentHTML = '<h1>Map</h1>'
const locations = JSON.parse(document.getElementById("map").dataset.locations);
// console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFja3Nvbi1peWFtdSIsImEiOiJjbDVxbHRsaDIxODNtM2puenVpMzZtOHV4In0.AejfqSm4fgrl27NCVdk8rQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  const el = document.createElement("div");
  el.className = "marker";

  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
