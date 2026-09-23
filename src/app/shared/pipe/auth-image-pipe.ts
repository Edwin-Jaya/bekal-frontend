import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Pipe({
  name: 'authImage',
})
export class AuthImagePipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  transform(url: string): Observable<SafeUrl> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((val: Blob) => {
        const objectURL = URL.createObjectURL(val);
        return this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }),
    );
  }
}
