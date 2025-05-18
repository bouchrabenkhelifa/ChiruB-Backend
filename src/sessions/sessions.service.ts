import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { CreateSessionDto } from './create-session.dto';
@Injectable()
export class SessionsService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }
async getHospitals() {
  const { data, error } = await this.supabase
    .from('hopital')    
    .select('*');

  if (error) {
    console.error('Erreur Supabase  :', error);
    return null;
  }

  return data;
}
async getSessions() {
  const { data, error } = await this.supabase
    .from('session')
    .select(`
      *,
      hopital:hopital_id (*),
      medecin_chef:user!medecin_chef_id (*),
      medecin1:user!medecin1_id (*),
      medecin2:user!medecin2_id (*)
    `);

  if (error) {
    console.error('Erreur Supabase (getSessions) :', error);
    return null;
  }

  const transformedData = data.map(session => {
    // Extraire les sous-objets (hopital, medecin_chef, etc)
    const { hopital, medecin_chef, medecin1, medecin2, ...rest } = session;
        return {
      ...rest, 
      // Préfixe hopital_
      hopital_id: hopital?.id ?? null,
      hopital_name: hopital?.name ?? null,
      hopital_address: hopital?.address ?? null,

      // Préfixe medecin_chef_
    
      medecin_chef_email: medecin_chef?.email ?? null,
      medecin_chef_fullname: medecin_chef?.fullname ?? null,
      medecin_chef_telephone: medecin_chef?.telephone ?? null,

      // Préfixe medecin1_
      medecin1_id: medecin1?.id ?? null,

      medecin1_fullname: medecin1?.fullname ?? null,
      medecin1_telephone: medecin1?.telephone ?? null,

      // Préfixe medecin2_
      medecin2_id: medecin2?.id ?? null,
      medecin2_fullname: medecin2?.fullname ?? null,
      medecin2_telephone: medecin2?.telephone ?? null,
    };
  });

  return transformedData;
}
async create(dto: CreateSessionDto) {
  console.log('Reçu depuis Postman :', dto); 

  const { data, error } = await this.supabase
    .from('session')
    .insert([dto])
    .select(); 

  if (error) {
    console.error('Erreur lors de la création de la session :', error); 
    throw new Error(error.message); 
  }

  return data[0]; 
}


}