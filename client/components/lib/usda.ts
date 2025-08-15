export async function searchFoods(query:string){
    if(!query) return [];
    console.log("Calling backend with query:", query);
    const res = await fetch(`http://localhost:8000/api/v1/foods?query=${encodeURIComponent(query)}`);
    if(!res.ok) throw new Error("Failed to fetch foods");
    const data=await res.json();

    return data.foods.map((item:any)=>({
        id: item.fdcId.toString(),
        name: item.description,
        calories: item.foodNutrients.find((n: any) => n.nutrientName === "Energy")?.value || 0,
        protein: item.foodNutrients.find((n: any) => n.nutrientName === "Protein")?.value || 0,
        carbs: item.foodNutrients.find((n: any) => n.nutrientName === "Carbohydrate, by difference")?.value || 0,
        fat: item.foodNutrients.find((n: any) => n.nutrientName === "Total lipid (fat)")?.value || 0,
        serving: "100g", // USDA default, can refine later
  }));

}