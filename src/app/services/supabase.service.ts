import { Injectable, NgZone } from "@angular/core";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class SupabaseService {
    private supabase: SupabaseClient | undefined;

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(environment.supabase.url, environment.supabase.apikey);
    });
  }

  async upload(file:File, fileName:string, folderName:string = 'base'){
    const { error } = await this.supabase!.storage.from('staynest')
        .upload(`${folderName}/${fileName}`, file);
    if(error){
      alert(error.message);
      return;
    }

    const { data } = this.supabase!.storage.from('staynest')
        .getPublicUrl(`${folderName}/${fileName}`)
    return data.publicUrl;
  }

  }
