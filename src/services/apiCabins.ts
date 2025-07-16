import type { Cabin } from '../models/cabin.model';
import supabase, { supabaseUrl } from '../utils/supabase';

export async function getCabins() {
  const { data: cabins, error } = await supabase
    .from('cabins')
    .select<string, Cabin>('*');

  if (error) {
    throw new Error(error.message);
  }

  return cabins;
}

export async function createCabin(
  cabinData: Omit<Cabin, 'id' | 'created_at' | 'image'> & { image: File }
) {
  const imageName = `${Math.random()}-${cabinData.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  const { data: createdCabin, error } = await supabase
    .from('cabins')
    .insert<Omit<Cabin, 'id' | 'created_at'>>([
      {
        name: cabinData.name,
        description: cabinData.description,
        discount: Number(cabinData.discount),
        maxCapacity: Number(cabinData.maxCapacity),
        regularPrice: Number(cabinData.regularPrice),
        image: imagePath,
      },
    ])
    .select<string, Cabin>()
    .single();

  console.log('created cabin: ', createdCabin);

  if (error) {
    throw new Error('Error creating cabin');
  }

  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, cabinData.image);

  if (storageError) {
    await supabase.from('cabins').delete().eq('id', createdCabin.id);
  }

  return createdCabin;
}

export async function deleteCabin(cabinId: number) {
  const { error } = await supabase.from('cabins').delete().eq('id', cabinId);

  if (error) {
    throw new Error('Cabin could not be deleted');
  }
}
