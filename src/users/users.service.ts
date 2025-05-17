import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_KEY')!
    );
  }
  async getUsers() {
  const { data, error } = await this.supabase
    .from('user')    
    .select('*');

  if (error) {
    console.error('Erreur Supabase (getUsers) :', error);
    return null;
  }

  return data;
}
async getDoctors() {
  const { data, error } = await this.supabase
    .from('medecin')
    .select(`
      *,
      user (
        fullname,
        email,
        telephone
      )
    `);

  if (error) {
    console.error('Erreur Supabase (getDoctors) :', error);
    return null;
  }

 const doctors = data
  .filter(doc => doc.user) 
  .map(doc => ({
    id: doc.id,
    user_id: doc.user_id,
    specialite: doc.specialite,
    fullname: doc.user.fullname,
    email: doc.user.email,
    telephone: doc.user.telephone,
  }));
  return doctors;
}

async getPatients() {
  const { data, error } = await this.supabase
    .from('patient')    
    .select('*');

  if (error) {
    console.error('Erreur Supabase (getUsers) :', error);
    return null;
  }

  return data;
}
  async createUser(userData: {
    email: string;
    password: string;
    fullname :String,
    telephone: string;
    role: string;  
  }) {
    const { email, password, fullname,telephone, role } = userData;
        const { data, error } = await this.supabase
      .from('user')
      .insert([
        { email, password,  fullname,telephone, role }  
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur Supabase (createUser) :', error);
      throw new Error('Erreur Supabase lors de la création de l\'utilisateur');
    }
    
    return { data };
  }
  
  
  async finduserByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('user')    
      .select('*')
      .eq('email', email)
      .single();     

    if (error) {
      console.error('Erreur Supabase (email) :', error);
      return null;
    }

    return data;
  }

  async findUserById(id: number) {
    const { data, error } = await this.supabase
      .from('user')     
      .select('id,fullname,telephone,email,role')
      .eq('id', id)
      .single();     

    if (error) {
      console.error('Erreur Supabase (id) :', error);
      return null;
    }

    return data;
  }

}
