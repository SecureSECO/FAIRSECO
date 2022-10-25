import { getContributors } from "../src/git";

test("Finds contributors", async () => {
    const contributors = await getContributors("QDUNI", "FairSECO");
    console.log(contributors);
    expect(true).toBeTruthy();
});
