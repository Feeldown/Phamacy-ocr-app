  import localDrugBackup from '../data/drug_backup.json';

// Drug data interfaces
export interface DrugData {
  ชื่อสามัญ: string;
  ชื่อการค้า: string;
  รูปแบบยา: string;
  "ยานี้ใช้สำหรับ": string;
  "วิธีการใช้ยา": string;
  "สิ่งที่ควรแจ้งให้แพทย์หรือเภสัชกรทราบ": string;
  "ทำอย่างไรหากลืมรับประทานยาหรือใช้ยา": string;
  "อาการไม่พึงประสงค์ทั่วไป": string;
  "อาการไม่พึงประสงค์ที่ต้องแจ้งแพทย์หรือเภสัชกรทันที": string;
  "การเก็บรักษายา": string;
  URL: string;
}

export interface DrugForm {
  form: string;
  count: number;
}

export const getAllDrugs = async (): Promise<DrugData[]> => {
  return localDrugBackup as DrugData[];
};

export const searchDrugsByName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter(
    (drug) =>
      drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
      drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByGenericName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter((drug) =>
    drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery)
  );
};

export const searchDrugsByBrandName = async (query: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  return all.filter((drug) =>
    drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)
  );
};

export const getDrugByBrandName = async (brandName: string): Promise<DrugData | undefined> => {
  const all = await getAllDrugs();
  return all.find(
    (drug) => drug.ชื่อการค้า.toLowerCase() === brandName.toLowerCase()
  );
};

export const getDrugByGenericName = async (genericName: string): Promise<DrugData | undefined> => {
  const all = await getAllDrugs();
  return all.find(
    (drug) => drug.ชื่อสามัญ.toLowerCase() === genericName.toLowerCase()
  );
};

export const getDrugsByForm = async (form: string): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  const normalizedForm = form.toLowerCase();
  return all.filter(
    (drug) => drug.รูปแบบยา.toLowerCase().includes(normalizedForm)
  );
};

export const getDrugByName = async (name: string): Promise<DrugData | undefined> => {
  const normalized = name.trim().toLowerCase();
  // ค้นหาชื่อการค้า
  let found = (localDrugBackup as DrugData[]).find(drug =>
    drug.ชื่อการค้า.trim().toLowerCase() === normalized
  ) ||
  (localDrugBackup as DrugData[]).find(drug =>
    drug.ชื่อการค้า.replace(/\s+/g, '').toLowerCase() === normalized.replace(/\s+/g, '')
  );
  // ถ้าไม่เจอ ลองค้นหาชื่อสามัญ
  if (!found) {
    found = (localDrugBackup as DrugData[]).find(drug =>
      drug.ชื่อสามัญ.trim().toLowerCase() === normalized
    ) ||
    (localDrugBackup as DrugData[]).find(drug =>
      drug.ชื่อสามัญ.replace(/\s+/g, '').toLowerCase() === normalized.replace(/\s+/g, '')
    );
  }
  return found;
};

export const getUniqueDrugForms = async (): Promise<DrugForm[]> => {
  const all = localDrugBackup as DrugData[];
  const formMap: { [form: string]: number } = {};
  all.forEach(drug => {
    const form = drug.รูปแบบยา.trim();
    formMap[form] = (formMap[form] || 0) + 1;
  });
  return Object.entries(formMap).map(([form, count]) => ({ form, count }));
};

export const searchDrugsEnhanced = async (
  query: string,
  searchType: 'all' | 'generic' | 'brand' = 'all',
  drugList?: DrugData[]
): Promise<DrugData[]> => {
  const all = drugList || await getAllDrugs();
  const normalizedQuery = query.toLowerCase();
  switch (searchType) {
    case 'generic':
      return all.filter(drug => 
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    case 'brand':
      return all.filter(drug => 
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
    default:
      return all.filter(drug =>
        drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery) ||
        drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery) ||
        drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(normalizedQuery) ||
        drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase().includes(normalizedQuery)
      );
  }
};

export const getSimilarDrugs = async (currentDrug: DrugData, limit: number = 5): Promise<DrugData[]> => {
  const all = await getAllDrugs();
  
  // ค้นหายาที่มีรูปแบบเดียวกัน
  const sameFormDrugs = all.filter(
    (drug) =>
      drug.รูปแบบยา === currentDrug.รูปแบบยา &&
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า
  );
  
  // ค้นหายาที่มีประโยชน์คล้ายกัน
  const similarUsesDrugs = all.filter(
    (drug) =>
      drug.ชื่อการค้า !== currentDrug.ชื่อการค้า &&
      drug['ยานี้ใช้สำหรับ'] &&
      currentDrug['ยานี้ใช้สำหรับ'] &&
      drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(
        currentDrug['ยานี้ใช้สำหรับ'].toLowerCase().split(' ')[0]
      )
  );
  
  // รวมและลบตัวซ้ำ
  const combined = [...sameFormDrugs, ...similarUsesDrugs];
  const unique = Array.from(new Map(combined.map(drug => [drug.ชื่อการค้า, drug])).values());
  
  // เรียงลำดับตามความคล้ายกัน
  const scored = unique.map(drug => {
    let score = 0;
    
    // ให้คะแนนตามรูปแบบยา
    if (drug.รูปแบบยา === currentDrug.รูปแบบยา) score += 3;
    
    // ให้คะแนนตามประโยชน์
    if (drug['ยานี้ใช้สำหรับ'] && currentDrug['ยานี้ใช้สำหรับ']) {
      const currentWords = currentDrug['ยานี้ใช้สำหรับ'].toLowerCase().split(/\s+/);
      const drugWords = drug['ยานี้ใช้สำหรับ'].toLowerCase().split(/\s+/);
      const commonWords = currentWords.filter(word => drugWords.includes(word));
      score += commonWords.length;
    }
    
    return { drug, score };
  });
  
  // เรียงตามคะแนนและคืนค่าตามจำนวนที่ต้องการ
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.drug);
};

export const getDrugsByFormAsync = async (form: string): Promise<DrugData[]> => {
  return getDrugsByForm(form);
}; 

// ค้นหายาแบบฉลาด: แยก keyword, ค้นหาทั้งชื่อสามัญ ชื่อการค้า และยานี้ใช้สำหรับ, เรียงตาม match count
export const searchDrugsSmart = async (query: string, drugList?: DrugData[]): Promise<DrugData[]> => {
  const all = drugList || await getAllDrugs();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const scored = all.map(drug => {
    const matchCount = keywords.reduce((acc, kw) => {
      if (
        drug.ชื่อสามัญ.toLowerCase().includes(kw) ||
        drug.ชื่อการค้า.toLowerCase().includes(kw) ||
        (drug['ยานี้ใช้สำหรับ'] && drug['ยานี้ใช้สำหรับ'].toLowerCase().includes(kw))
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { drug, matchCount };
  });

  return scored
    .filter(item => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(item => item.drug);
};

// ฟังก์ชันค้นหาใหม่ที่รองรับ case-insensitive และ fuzzy search
export const searchDrugsAdvanced = async (
  query: string, 
  options: {
    caseSensitive?: boolean;
    fuzzy?: boolean;
    searchFields?: ('name' | 'generic' | 'brand' | 'uses' | 'sideEffects')[];
    limit?: number;
  } = {}
): Promise<DrugData[]> => {
  const {
    caseSensitive = false,
    fuzzy = true,
    searchFields = ['name', 'generic', 'brand', 'uses', 'sideEffects'],
    limit
  } = options;

  const all = await getAllDrugs();
  
  if (!query.trim()) return [];

  const normalizedQuery = caseSensitive ? query.trim() : query.trim().toLowerCase();
  const keywords = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = all.map(drug => {
    let score = 0;
    let exactMatches = 0;
    let partialMatches = 0;

    keywords.forEach(keyword => {
      // ค้นหาในชื่อสามัญ
      if (searchFields.includes('generic')) {
        const genericName = caseSensitive ? drug.ชื่อสามัญ : drug.ชื่อสามัญ.toLowerCase();
        if (genericName === keyword) {
          score += 100; // Exact match ได้คะแนนสูงสุด
          exactMatches++;
        } else if (genericName.startsWith(keyword)) {
          score += 50; // ขึ้นต้นด้วยคำค้นหา
          partialMatches++;
        } else if (genericName.includes(keyword)) {
          score += 10; // มีคำค้นหาอยู่ในชื่อ
          partialMatches++;
        }
      }

      // ค้นหาในชื่อการค้า
      if (searchFields.includes('brand')) {
        const brandName = caseSensitive ? drug.ชื่อการค้า : drug.ชื่อการค้า.toLowerCase();
        if (brandName === keyword) {
          score += 100;
          exactMatches++;
        } else if (brandName.startsWith(keyword)) {
          score += 50;
          partialMatches++;
        } else if (brandName.includes(keyword)) {
          score += 10;
          partialMatches++;
        }
      }

      // ค้นหาในสรรพคุณ
      if (searchFields.includes('uses') && drug['ยานี้ใช้สำหรับ']) {
        const uses = caseSensitive ? drug['ยานี้ใช้สำหรับ'] : drug['ยานี้ใช้สำหรับ'].toLowerCase();
        if (uses.includes(keyword)) {
          score += 5;
          partialMatches++;
        }
      }

      // ค้นหาในอาการไม่พึงประสงค์
      if (searchFields.includes('sideEffects') && drug['อาการไม่พึงประสงค์ทั่วไป']) {
        const sideEffects = caseSensitive ? drug['อาการไม่พึงประสงค์ทั่วไป'] : drug['อาการไม่พึงประสงค์ทั่วไป'].toLowerCase();
        if (sideEffects.includes(keyword)) {
          score += 3;
          partialMatches++;
        }
      }
    });

    // Bonus สำหรับการจับคู่หลายคำ
    if (keywords.length > 1) {
      score += Math.min(exactMatches, keywords.length) * 20;
      score += Math.min(partialMatches, keywords.length) * 5;
    }

    return { drug, score, exactMatches, partialMatches };
  });

  // กรองและเรียงลำดับผลลัพธ์
  const filtered = scored
    .filter(item => item.score > 0)
    .sort((a, b) => {
      // เรียงตามคะแนนรวม
      if (b.score !== a.score) return b.score - a.score;
      
      // ถ้าคะแนนเท่ากัน เรียงตามจำนวน exact matches
      if (b.exactMatches !== a.exactMatches) return b.exactMatches - a.exactMatches;
      
      // ถ้า exact matches เท่ากัน เรียงตามจำนวน partial matches
      if (b.partialMatches !== a.partialMatches) return b.partialMatches - a.partialMatches;
      
      // สุดท้ายเรียงตามชื่อการค้า
      return a.drug.ชื่อการค้า.localeCompare(b.drug.ชื่อการค้า, 'th');
    });

  // คืนค่าตามจำนวนที่ต้องการ
  if (limit) {
    return filtered.slice(0, limit).map(item => item.drug);
  }

  return filtered.map(item => item.drug);
};

// ฟังก์ชันสำหรับค้นหาคำแนะนำ (autocomplete)
export const getSearchSuggestions = async (
  partialQuery: string, 
  limit: number = 10
): Promise<string[]> => {
  if (!partialQuery.trim() || partialQuery.trim().length < 2) return [];

  const all = await getAllDrugs();
  const normalizedQuery = partialQuery.trim().toLowerCase();
  
  const suggestions = new Set<string>();

  all.forEach(drug => {
    // เพิ่มชื่อการค้าที่ตรงกับคำค้นหา
    if (drug.ชื่อการค้า.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(drug.ชื่อการค้า);
    }
    
    // เพิ่มชื่อสามัญที่ตรงกับคำค้นหา
    if (drug.ชื่อสามัญ.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(drug.ชื่อสามัญ);
    }
  });

  // เรียงลำดับและคืนค่า
  return Array.from(suggestions)
    .sort((a, b) => {
      // ให้ความสำคัญกับคำที่ขึ้นต้นด้วยคำค้นหา
      const aStartsWith = a.toLowerCase().startsWith(normalizedQuery);
      const bStartsWith = b.toLowerCase().startsWith(normalizedQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // ถ้าทั้งคู่ขึ้นต้นด้วยคำค้นหาหรือไม่ขึ้นต้น ให้เรียงตามความยาว
      return a.length - b.length;
    })
    .slice(0, limit);
}; 