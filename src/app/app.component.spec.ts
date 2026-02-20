import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AppComponent } from './app.component';
import { ResourcesService } from 'src/app/resources.service';

describe('AppComponent', () => {
    const makeResourcesService = (cfg?: Partial<ResourcesService>) =>
        ({
            getPositiveWords: () => of(['bueno', 'genial']),
            getNegativeWords: () => of(['malo', 'horrible']),
            getStopWords: () => of(['y', 'el', 'la']),
            ...cfg,
        }) as unknown as ResourcesService;

    const setup = async (service?: ResourcesService) => {
        await TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [{ provide: ResourcesService, useValue: service ?? makeResourcesService() }],
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        const component = fixture.componentInstance;
        return { fixture, component };
    };

    it('crea el componente', async () => {
        const { component } = await setup();
        expect(component).toBeTruthy();
    });

    it('carga positiveWords, negativeWords y stopWords en el constructor', async () => {
        const { component } = await setup(
            makeResourcesService({
                getPositiveWords: () => of(['a']),
                getNegativeWords: () => of(['b']),
                getStopWords: () => of(['c']),
            })
        );

        expect(component.positiveWords).toEqual(['a']);
        expect(component.negativeWords).toEqual(['b']);
        expect(component.stopWords).toEqual(['c']);
    });

    it('si falla getPositiveWords no revienta y deja positiveWords vacío', async () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => { });
        const { component } = await setup(
            makeResourcesService({
                getPositiveWords: () => throwError(() => new Error('fail')),
            })
        );

        expect(component.positiveWords).toEqual([]);
        log.mockRestore();
    });

    it('si falla getNegativeWords no revienta y deja negativeWords vacío', async () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => { });
        const { component } = await setup(
            makeResourcesService({
                getNegativeWords: () => throwError(() => new Error('fail')),
            })
        );

        expect(component.negativeWords).toEqual([]);
        log.mockRestore();
    });

    it('si falla getStopWords no revienta y deja stopWords vacío', async () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => { });
        const { component } = await setup(
            makeResourcesService({
                getStopWords: () => throwError(() => new Error('fail')),
            })
        );

        expect(component.stopWords).toEqual([]);
        log.mockRestore();
    });

    it('modelChanged actualiza analyzer y pone result=false si analyzer es vacío', async () => {
        const { component } = await setup();

        component.result = true;
        component.modelChanged('');
        expect(component.analyzer).toBe('');
        expect(component.result).toBe(false);

        component.result = true;
        component.modelChanged('hola');
        expect(component.analyzer).toBe('hola');
        expect(component.result).toBe(true);
    });

    it('removePunctuation elimina signos', async () => {
        const { component } = await setup();
        const out = component.removePunctuation('hola, mundo! (bien) - ok?');
        expect(out).toBe('hola mundo bien  ok');
    });

    it('removeStopWords elimina stopwords (case-insensitive) y mantiene el resto', async () => {
        const { component } = await setup();
        component.stopWords = ['y', 'el'];

        const out = component.removeStopWords(['Hola', 'y', 'EL', 'mundo']);
        expect(out).toEqual(['Hola', 'mundo']);
    });

    it('calculatePositives cuenta palabras positivas (case-insensitive)', async () => {
        const { component } = await setup();
        component.positiveWords = ['bueno', 'genial'];

        component.calculatePositives(['BUENO', 'malo', 'Genial', 'otro']);
        expect(component.positives).toBe(2);
    });

    it('calculateNegatives cuenta palabras negativas (case-insensitive)', async () => {
        const { component } = await setup();
        component.negativeWords = ['malo', 'horrible'];

        component.calculateNegatives(['bueno', 'MALO', 'Horrible', 'otro']);
        expect(component.negatives).toBe(2);
    });

    it('analyze no cambia el estado si no están cargadas las listas', async () => {
        const { component } = await setup();

        component.analyzer = 'bueno malo';
        component.result = false;
        component.positives = 99;
        component.negatives = 99;

        component.positiveWords = [];
        component.negativeWords = ['malo'];
        component.stopWords = ['y'];

        component.analyze();

        expect(component.result).toBe(false);
        expect(component.positives).toBe(99);
        expect(component.negatives).toBe(99);
    });

    it('analyze pone result=true y calcula positivos/negativos', async () => {
        const { component } = await setup();

        component.positiveWords = ['bueno'];
        component.negativeWords = ['malo'];
        component.stopWords = ['y', 'el'];

        component.analyzer = 'Bueno, y malo! el bueno.';
        component.result = false;

        component.analyze();

        expect(component.result).toBe(true);
        expect(component.positives).toBe(2);
        expect(component.negatives).toBe(1);
    });

    it('analyze pone positives/negatives a 0 si analyzer está vacío', async () => {
        const { component } = await setup();

        component.positiveWords = ['bueno'];
        component.negativeWords = ['malo'];
        component.stopWords = ['y'];

        component.analyzer = '';
        component.positives = 5;
        component.negatives = 5;

        component.analyze();

        expect(component.positives).toBe(0);
        expect(component.negatives).toBe(0);
    });

    it('template: muestra resultado positivo cuando positives > negatives', async () => {
        const { fixture, component } = await setup();

        component.result = true;
        component.positives = 2;
        component.negatives = 1;
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('¡Gracias por ese comentario tan positivo!');
        expect(el.textContent).toContain('Coincidencia de palabras positivas: 2');
        expect(el.textContent).toContain('Coincidencia de palabras negativas: 1');
    });

    it('template: muestra resultado negativo cuando positives < negatives', async () => {
        const { fixture, component } = await setup();

        component.result = true;
        component.positives = 1;
        component.negatives = 2;
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('Creo que tu comentario no es de lo más apropiado.');
    });

    it('template: muestra resultado neutral cuando positives === negatives', async () => {
        const { fixture, component } = await setup();

        component.result = true;
        component.positives = 2;
        component.negatives = 2;
        fixture.detectChanges();

        const el: HTMLElement = fixture.nativeElement;
        expect(el.textContent).toContain('Tu comentario no es relevante para mí. Prueba otra cosa.');
    });

    it('template: input change llama a modelChanged', async () => {
        const { fixture, component } = await setup();
        const spy = vi.spyOn(component, 'modelChanged');

        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

        input.value = 'hola';
        input.dispatchEvent(new Event('change'));
        expect(spy).toHaveBeenCalledWith('hola');
    });

    it('template: enter llama a analyze', async () => {
        const { fixture, component } = await setup();
        const spy = vi.spyOn(component, 'analyze');

        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

        input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        expect(spy).toHaveBeenCalled();
    });

    it('template: click en la imagen llama a analyze', async () => {
        const { fixture, component } = await setup();
        const spy = vi.spyOn(component, 'analyze');

        fixture.detectChanges();
        const img = fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement;

        img.click();
        expect(spy).toHaveBeenCalled();
    });
});