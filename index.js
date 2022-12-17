const $wrapper = document.querySelector("[data-wrapper]");
const $addButton = document.querySelector("[data-add_button]");
const $modal = document.querySelector("[data-modal]");
const $form = document.querySelector("form");
const $modalShow = document.querySelector("[data-modal_show]");
const $errorMessage = document.querySelector("[data-error]");
const $modalEdit = document.querySelector("[data-modal_edit]");

const api = new Api("dsavostin");

const generationCatCard = (
  cat
) => `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
<img src="${cat.image}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <h5 class="card-title">${cat.name}</h5>
  <p class="card-text">Age: ${cat.age}</p>
  <p class="card-text">Rating: ${cat.rate}</p>
  <p class="card-text">Favorite: ${cat.favorite}</p>
  <button data-action="show" class="btn btn-primary">About</button>
  <button data-action="delete" class="btn btn-danger">Delete</button>
  <button data-action="edit" class="btn btn-warning">Edit</button>
</div>
</div>`;

$wrapper.addEventListener("click", (event) => {
  switch (event.target.dataset.action) {
    case "delete":
      const $currentCard = event.target.closest("[data-card_id]");
      const catId = $currentCard.dataset.card_id;
      api.delCat(catId);
      $currentCard.remove();
      break;

    case "show":
      $modalEdit.classList.remove("hidden");
      const $currentCardEdit = event.target.closest("[data-card_id]");
      const catIdEdit = $currentCardEdit.dataset.card_id;
      const showCat = async (catIdEdit) => {
        const response = await api.getCat(catIdEdit);
        const data = await response.json();
        document.querySelector(
          ".cat-description"
        ).innerHTML = `${data.description}`;
      };
      showCat(catIdEdit);
      break;
    case "edit":
      //TODO: добавить форму редактирования
      break;

    default:
      break;
  }
});

document.forms.catsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target).entries());

  data.age = Number(data.age);
  data.id = Number(data.id);
  data.rate = Number(data.rate);
  data.favorite = data.favorite === "on";

  console.log(data);

  const addingCat = async (data) => {
    const response = await api.addCat(data);
    const errorMsg = await response.json();
    response.ok ? gettingCats() : errorMsg;
    $errorMessage.innerHTML = errorMsg.message;
  };
  addingCat(data);
});

$addButton.addEventListener("click", () => {
  $modal.classList.remove("hidden");
});

const gettingCats = async () => {
  const response = await api.getCats();
  const data = await response.json();
  $wrapper.childNodes.forEach((element) => element.remove());
  data.forEach((cat) => {
    $wrapper.insertAdjacentHTML("beforeend", generationCatCard(cat));
  });
  $errorMessage.innerHTML = "";
  return $modal.classList.add("hidden");
};
gettingCats();

document.addEventListener("keydown", (e) => {
  if (e.key == "Escape") {
    $modal.classList.add("hidden");
    $modalEdit.classList.add("hidden");
    $form.reset();
  }
});
$modal.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-modal")) {
    $modal.classList.add("hidden");
    $form.reset();
  }
});

$modalEdit.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-modal")) {
    $modalEdit.classList.add("hidden");
  }
});

// LocalStorage
const dataFromStorage = localStorage.getItem(document.forms.catsForm.name);

const parsedDataFromStorage = dataFromStorage
  ? JSON.parse(dataFromStorage)
  : null;

if (parsedDataFromStorage) {
  Object.keys(parsedDataFromStorage).forEach((key) => {
    document.forms.catsForm[key].value = parsedDataFromStorage[key];
  });
}

document.forms.catsForm.addEventListener("input", () => {
  const formData = Object.fromEntries(
    new FormData(document.forms.catsForm).entries()
  );
  localStorage.setItem(document.forms.catsForm.name, JSON.stringify(formData));
});
