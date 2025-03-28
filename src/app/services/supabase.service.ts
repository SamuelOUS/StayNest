import { Injectable, NgZone } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseBucketService {
  private supabase: SupabaseClient | undefined;

  constructor(private readonly ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.supabase = createClient(
        environment.supabase.url,
        environment.supabase.apikey
      );
    });
  }

  async upload(file: File, fileName: string, folderName: string = 'base', bucketName:string) {
    const { error } = await this.supabase!.storage.from(bucketName).upload(
      `${folderName}/${fileName}`,
      file
    );
    if (error) {
      throw error
    }

    const { data } = this.supabase!.storage.from(bucketName).getPublicUrl(
      `${folderName}/${fileName}`
    );
    return data.publicUrl;
  }

  async deletePhoto(imageUrl: string, bucketName:string, folderName = 'base') {
    const id = imageUrl.split('/').slice(-1)[0];
    return await this.supabase!
      .storage
      .from(bucketName)
      .remove([`${folderName}/${id}`])
  }

}
