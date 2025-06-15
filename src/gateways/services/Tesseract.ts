import { createWorker } from 'tesseract.js'
import { ITesseractExtract } from '../../domain/services/ITesseract';
import { AadhaarData } from '../../../types';

export class TesseractExtract implements ITesseractExtract {

    private parseAadhaarText (text: string): AadhaarData {

    const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1);

    const data: AadhaarData = {};
    const addressLines: string[] = [];

    const junkPatterns = [
        /government/i,
        /uidai/i,
        /help@/i,
        /www\./i,
        /^1800/,
        /^PO Box/i,
        /authority/i,
        /unique/i,
        /identification/i,
        /india/i,
        /~~/, /www/, /@/, /[^\x00-\x7F]+/,
        /^[^a-zA-Z0-9]+$/,
        /^\d{4}$/,
    ];

    const isJunkLine = (line: string) =>
        junkPatterns.some(pattern => pattern.test(line));

    const cleanText = (text: string) =>
        text.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ').trim();

    const isValidName = (name: string) =>
        /^[A-Z][a-zA-Z]+(\s[A-Z][a-zA-Z]+)+$/.test(name) && !isJunkLine(name);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (isJunkLine(line)) continue;

        // Aadhaar number (12 digits)
        if (!data.aadhaarNumber) {
        const digits = line.replace(/[^\d]/g, '');
        if (digits.length === 12) {
            data.aadhaarNumber = digits.replace(/^(.{4})(.{4})(.{4})$/, '$1 $2 $3');
            continue;
        }
        }

        // DOB detection
        if (!data.dob) {
        const dobMatch = line.match(/(\d{2}\/\d{2}\/\d{4})/);
        if (dobMatch) {
            data.dob = dobMatch[1];

            // Name likely in the line above
            const rawName = lines[i - 1] || '';
            const cleaned = cleanText(rawName.replace(/^([a-z]{0,3})\s?/i, ''));

            if (!data.name && cleaned.split(' ').length >= 2) {
            data.name = cleaned;
            }
            continue;
        }
        }

        // Gender
        if (!data.gender) {
        const genderMatch = line.match(/\b(male|female|others?)\b/i);
        if (genderMatch) {
            data.gender = genderMatch[1].toUpperCase();
            continue;
        }
        }

        // Address detection
        const lower = line.toLowerCase();
        if (
        lower.includes('house') ||
        lower.includes('colony') ||
        lower.includes('p o') ||
        lower.includes('kerala') ||
        lower.includes('thiruvananthapuram') ||
        lower.includes('address') ||
        /^[0-9]{6}$/.test(line)
        ) {
        addressLines.push(line);
        }
    }

    // Secondary pass for name if still missing
    if (!data.name) {
        for (const line of lines) {
        const cleaned = cleanText(line);
        if (cleaned.split(' ').length >= 2 && isValidName(cleaned)) {
            data.name = cleaned;
            break;
        }
        }
    }

    // Final cleanup for address
    if (addressLines.length) {
        const cleanAddr = addressLines
        .map(l => l.replace(/[^\w\s,-]/g, '').replace(/\s+/g, ' ').trim())
        .filter(line => line.length > 5 && !isJunkLine(line));

        data.address = [...new Set(cleanAddr)].join(', ');
    }

    return data;
    };

    async extract (file: Express.Multer.File): Promise<AadhaarData> {
        const worker = await createWorker('eng')
        const {data} = await worker.recognize(file.buffer);
        await worker.terminate();
        const stucturedData = this.parseAadhaarText(data.text);
        return stucturedData;
    };
};

export const tesseractExtract = new TesseractExtract();