class ImageGallery {
  constructor(
    {
      buttonsClass,
      buttonDataKey = "type",
      imageContainerClass,
      defaultImagePath,
      imageCssClass,
      imagesInCache = 100,
      apiUrl = "https://shibe.online/api/",
    },
  ) {
    this.buttonsClass = buttonsClass;
    this.buttonDataKey = buttonDataKey;
    this.imageContainerClass = imageContainerClass;
    this.defaultImagePath = defaultImagePath;
    this.imageCssClass = imageCssClass;
    this.imagesInCache = imagesInCache;
    this.apiUrl = apiUrl;

    this.arrShibe = [];
    this.arrGato = [];
    this.arrBirb = [];

    this.refreshImages();
  }

  refreshImages() {
    const imageTypes = [{
      type: "arrShibe",
      apiName: "shibes",
    }, {
      type: "arrGato",
      apiName: "cats",
    }, {
      type: "arrBirb",
      apiName: "birds",
    }];
    imageTypes.forEach(async ({type, apiName}) => {
      if (this[type].length === 0) {
        try {
          this[type] = await fetch(`${this.apiUrl}${apiName}?count=${this.imagesInCache}`)
            .then((response) => response.json())
            .then((data) => data);
        } catch (ex) {
          console.error(`Can't refresh images type: ${imageType}`, ex);
          this.arrShibe = [this.defaultImagePath];
        }
      }
    });
  }

  init() {
    this.buttons = document.querySelectorAll(`.${this.buttonsClass}`);
    this.imageContainer = document.querySelector(`.${this.imageContainerClass}`);
    this.currentImage = document.createElement("img");
    this.currentImage.src = this.defaultImagePath;
    this.currentImage.classList.add(this.imageCssClass);
    this.currentImage.setAttribute("alt", "");

    this.imageContainer.append(this.currentImage);

    this.buttons.forEach((button) => {
      button.addEventListener("click", this.handleButtonClick);
    });
  }

  handleButtonClick = async (ev) => {
    ev.preventDefault();
    const type = ev.target.dataset[this.buttonDataKey];
    const mapping = {
      shibe: () => this.arrShibe.pop(),
      gato: () => this.arrGato.pop(),
      birb: () => this.arrBirb.pop(),
    };
    if (typeof mapping[type] === "function") {
      const src = mapping[type]();
      this.refreshImages();
      this.setNewImage(src);
    } else {
      console.error("button doesn't have correct data attribute");
    }
  };

  setNewImage(src) {
    const newImage = document.createElement("img");
    newImage.src = src;
    newImage.setAttribute("alt", "");
    newImage.classList.add(this.imageCssClass);
    this.imageContainer.append(newImage);


    const animation = this.currentImage.animate(
      [{transform: "translate3D(0, 0, 0)"}, {transform: "translate3D(100%, 0, 0)"}],
      {
        duration: 500,
        iterations: 1,
        easing: "linear",
        fill: "both",
      },
    );
    animation.onfinish = () => {
      console.log("EMD");
      this.imageContainer.removeChild(this.currentImage);
      this.currentImage = newImage;
    }
    newImage.animate(
      [{transform: "translate3D(-100%, 0, 0)"}, {transform: "translate3D(0, 0, 0)"}],
      {
        duration: 500,
        iterations: 1,
        easing: "linear",
        fill: "both",
      },
    );
  }

  // not used now, but need in case of
  // single page application architecture
  // to avoid memory leaks
  remove() {
    this.buttons.forEach((button) => {
      button.removeEventListener("click", this.handleButtonClick);
    });
    this.imageContainer.removeChild(this.currentImage);
    this.arrShibe = [];
    this.arrGato = [];
    this.arrBirb = [];
  }
}

const imageGallery = new ImageGallery({
  buttonsClass: "js-button",
  imageContainerClass: "js-image-container",
  defaultImagePath: "./images/shibe.jpeg",
  imageCssClass: "content__img",
});
imageGallery.init();
