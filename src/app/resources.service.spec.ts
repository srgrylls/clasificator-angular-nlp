import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ResourcesService } from './resources.service';

describe('ResourcesService', () => {
    let service: ResourcesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ResourcesService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(ResourcesService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('getPositiveWords hace GET a /assets/positives.json', () => {
        service.getPositiveWords().subscribe((res) => {
            expect(res).toEqual(['a']);
        });

        const req = httpMock.expectOne('/assets/positives.json');
        expect(req.request.method).toBe('GET');
        req.flush(['a']);
    });

    it('getNegativeWords hace GET a /assets/negatives.json', () => {
        service.getNegativeWords().subscribe((res) => {
            expect(res).toEqual(['b']);
        });

        const req = httpMock.expectOne('/assets/negatives.json');
        expect(req.request.method).toBe('GET');
        req.flush(['b']);
    });

    it('getStopWords hace GET a /assets/stopwords.json', () => {
        service.getStopWords().subscribe((res) => {
            expect(res).toEqual(['c']);
        });

        const req = httpMock.expectOne('/assets/stopwords.json');
        expect(req.request.method).toBe('GET');
        req.flush(['c']);
    });
});