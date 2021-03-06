const firebase = require("@firebase/rules-unit-testing");
const fs = require("fs");
const http = require("http");

/**
 * The emulator will accept any project ID for testing.
 */
const PROJECT_ID = "objects-omsistuff";

/**
 * The FIRESTORE_EMULATOR_HOST environment variable is set automatically
 * by "firebase emulators:exec"
 */
const COVERAGE_URL = `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}:ruleCoverage.html`;

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth) {
    return firebase
        .initializeTestApp({ projectId: PROJECT_ID, auth })
        .firestore();
}

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

before(async () => {
    // Load the rules file before the tests begin
    const rules = fs.readFileSync("firestore.rules", "utf8");
    await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

after(async () => {
    // Delete all the FirebaseApp instances created during testing
    // Note: this does not affect or clear any data
    await Promise.all(firebase.apps().map((app) => app.delete()));

    // Write the coverage report to a file
    const coverageFile = 'test/firestore-coverage.html';
    const fstream = fs.createWriteStream(coverageFile);
    await new Promise((resolve, reject) => {
        http.get(COVERAGE_URL, (res) => {
            res.pipe(fstream, { end: true });

            res.on("end", resolve);
            res.on("error", reject);
        });
    });
  
    console.log(`View firestore rule coverage information at ${coverageFile}\n`);
});

describe("Articles", () => {
    const db = getAuthedFirestore({
        uid: "author",
        email: "alice@example.com"
    });
    const article = db.collection("articles").doc("articleId");
    const data = {
        uid: "author",
        title: "Lorem Ipsum",
        content: "lorem ipsum dolor sit amet",
        category: "any",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        published: false
    };
    const updatedData = {
        uid: data.uid,
        createdAt: data.createdAt,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    it("L'utilisateur doit ??tre connect?? pour poster un article", async () => {
        await firebase.assertSucceeds(article.set(data));
    });

    it("L'uid renseign?? doit ??tre le sien", async () => {
        invalidData = data;
        invalidData.uid = "otherPeople";
        await firebase.assertFails(article.set(data));
    });

    it("Les timestamp ne doivent pas ??tre alt??r??s", async () => {
        invalidData = data;
        invalidData.createdAt = new firebase.firestore.Timestamp(1);
        await firebase.assertFails(article.set(data));
    });

    it("La valeur de published doit ??tre d??finie ?? false", async () => {
        invalidData = data;
        invalidData.published = true;
        await firebase.assertFails(article.set(data));
    });

    it("Un utilisateur ne peut pas modifier l'article de quelqu'un d'autre", async () => {
        const otherPeopleArticle = getAuthedFirestore({
            uid: "notAuthor"
        })
        .collection("articles").doc("articleId");
        otherPeopleArticle.get().then(doc => {
            firebase.assertFails(doc.update(updatedData));
        });
    })

    it("L'utilisateur peut modifier son article", async () => {
        article.get().then(doc => {
            firebase.assertFails(doc.update(updatedData));
        });
    });

    it("Les champs uid, published ou createdAt ne peuvent pas ??tre modifi??s", async () => {
        updatedDataModifiedUid = updatedData;
        updatedDataModifiedUid.uid = "other";
        updatedDataModifiedPublished = updatedData;
        updatedDataModifiedPublished.published = true;
        updatedDataModifiedCreatedAt = updatedData;
        updatedDataModifiedCreatedAt.createdAt = new firebase.firestore.Timestamp(1);
        article.get().then(doc => {
            firebase.assertFails(doc.update(updatedDataModifiedUid));
            firebase.assertFails(doc.update(updatedDataModifiedPublished));
            firebase.assertFails(doc.update(updatedDataModifiedCreatedAt));
        });
    });

    it('On ne peut r??cup??rer que 20 articles a la fois', async () => {
        firebase.assertSucceeds(db.collection('articles')
            .orderBy('createdAt', 'desc')
            .where('published', '==', true)
            .limit(20)
            .get())
        firebase.assertFails(db.collection('articles')
            .orderBy('createdAt', 'desc')
            .where('published', '==', true)
            .limit(21)
            .get())
    })

    it('On ne peut pas lister des articles non publi??s', async () => {
        firebase.assertFails(db.collection('articles')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get())
    })

    it('On peut lister nos articles non publi??s', async () => {
        firebase.assertSucceeds(db.collection('articles')
            .orderBy('createdAt', 'desc')
            .where('uid', '==', 'author')
            .limit(20)
            .get())
    })
});

describe("Users", () => {
    const db = getAuthedFirestore({
        uid: "author",
        email: "alice@example.com"
    });
    const user = db.collection("users").doc("author");
    const data = {
        uid: "author",
        name: "Jonh Doe",
        profilePic: "https://img.com/example.jpg"
    };
    let otherUser = data
    otherUser.uid = "other"

    it("L'utilisateur ne peut modifier ou cr??er que son profil", async () => {
        await firebase.assertSucceeds(user.set(data));
        await firebase.assertSucceeds(user.update(data));
        await firebase.assertFails(user.set(otherUser));
        await firebase.assertFails(user.update(otherUser));
    });
});