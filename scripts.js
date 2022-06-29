const imageSize = 600;
const imageUrl = (id) => `https://picsum.photos/id/${id}/${imageSize}/${imageSize}`;
const noop = () => null;

const App = {
    imageList: [],
    preloadImageList: [],
    currentPage: 1,
    numImages: 6,
    button$: document.querySelector('button'),
    list$: document.querySelector('ul'),
    preloads$: document.querySelector('.preloads'),
    dfPreload$: undefined,
    df$: undefined,

    imageHelper(image) {
        const img = document.createElement('img');
        img.setAttribute('src', image.url);
        img.setAttribute('alt', image.alt);
        return img;
    },

    async loadHelper(list) {
        const imageResponseBlob = await fetch(`https://picsum.photos/v2/list?page=${this.currentPage}&limit=${this.numImages}`)
        const imageResponse = await imageResponseBlob.json()
        list.length = 0;
        list.push(...
            imageResponse.map(image => {
                return {
                    url: imageUrl(image.id),
                    alt: image.author
                }
            })
        );
        return this;
    },

    async init() {
        // this.df$ = document.createDocumentFragment();
        // for (let i = this.numImages; i > 0; i--) {
        //     this.df$.appendChild(this.imageHelper({url: 'img.png', alt: ''}));
        // }
        //
        // this.list$.replaceChildren(this.df$)

        await this.loadHelper(this.imageList);
        this.li_C().increment_C();
        await this.loadHelper(this.preloadImageList);
        this.liPreload_C().increment_C();
        this.button$.addEventListener('click', await this.run.bind(this));
    },

    async run() {
        this.swapImages_C().li_C().increment_C();
        await this.loadHelper(this.preloadImageList);
        this.liPreload_C();
    },

    swapImages_C() {
        this.imageList.length = 0;
        this.imageList.push(...this.preloadImageList);
        return this;
    },

    li_C() {
        this.df$ = document.createDocumentFragment();
        this.imageList.forEach(image => {
                const li = document.createElement('li');
                li.append(this.imageHelper(image));
                this.df$.appendChild(li);
            }
        )
        this.list$.replaceChildren(this.df$);
        return this;
    },

    liPreload_C() {
        this.dfPreload$ = document.createDocumentFragment();
        this.preloadImageList.forEach(image => {
                this.dfPreload$.appendChild(this.imageHelper(image));
            }
        )
        this.preloads$.replaceChildren(this.dfPreload$);
        return this;
    },

    increment_C() {
        this.currentPage++;
        return this;
    },
}


App.init()
    .then(noop)
    .catch(noop);
