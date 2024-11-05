import { Injectable,NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreatePropertiesService {

  supabase : SupabaseClient|undefined; 

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(environment.supabase.url, environment.supabase.apikey);
    })
  }

  async uploadImage(file:File, fileName:string, folderName:string = 'base'){

    const { error } = await this.supabase!.storage.from('StayNestImages').upload(`${folderName}/${fileName}`, file);
    if(error){
      console.log(error.message);
      return;
    }

    const { data } = await this.supabase!
      .storage
      .from('StayNestImages')
      .getPublicUrl(`${folderName}/${fileName}`)
      console.log(data.publicUrl)
    return data.publicUrl;
  }

}
