export interface Product {
  artikelcode: string;
  artikelomschrijving: string;
  afbeelding: string;
  potmaat: string;
  verpakkingsinhoud: string;
  wetenschappelijkeNaam?: string;
  prijs?: number; // Prijs per stuk (exclusief BTW)
  voorraad?: number; // Aantal op voorraad
  beschikbaar?: boolean; // Of product beschikbaar is
  categorie?: string; // Categorie van het product (bijv. "Shrubs", "Fruit", "Bomen")
  createdAt?: Date;
  updatedAt?: Date;
}


