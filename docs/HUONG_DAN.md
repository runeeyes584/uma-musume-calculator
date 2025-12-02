# Hướng Dẫn Sử Dụng Uma Musume Calculator

## 📖 Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Hướng dẫn sử dụng cho người chơi](#hướng-dẫn-sử-dụng-cho-người-chơi)
3. [Hướng dẫn quản lý Skills](#hướng-dẫn-quản-lý-skills)
4. [Cấu trúc dữ liệu](#cấu-trúc-dữ-liệu)
5. [Công cụ và Scripts](#công-cụ-và-scripts)
6. [Tham khảo nhanh](#tham-khảo-nhanh)
7. [Xử lý lỗi](#xử-lý-lỗi)

---

## Giới thiệu

Uma Musume Calculator là công cụ tính điểm và đánh giá Uma Musume của bạn dựa trên:
- **Stats** (Speed, Stamina, Power, Guts, Wisdom)
- **Star Rating** (1-5 sao)
- **Skills** (439 skills qua 7 màu)
- **Aptitudes** (Khả năng thiên bẩm)
- **Unique Skills** (Skills đặc biệt của từng Uma)

### Thống kê hiện tại:
- ✅ **58 Uma Musume** (bao gồm các variants)
- ✅ **439 Skills** (IUS: 57, Golden: 114, Yellow: 106, Blue: 26, Green: 74, Red: 30, Purple: 32)
- ✅ **4 bậc Aptitude** (S-A, B-C, D-E-F, G)
- ✅ **Auto-adjustment** theo Uma được chọn

---

## Hướng dẫn sử dụng cho người chơi

### Cài đặt

1. **Tải về hoặc clone repository**
2. **Mở file `index.html`** trong trình duyệt (Chrome, Firefox, Edge)
3. **Không cần cài đặt gì thêm!**

### Sử dụng cơ bản

#### 1. Chọn Uma Musume
```
Div1 (Góc trên bên trái):
├── Dropdown "Your Uma"
└── Chọn Uma từ 58 options
```

**Khi chọn Uma:**
- Avatar và tên Uma hiển thị
- **Aptitudes tự động điền** (Track, Distance, Style)
- **Unique Skill hiển thị** (nếu có)

#### 2. Nhập Stats
```
Div2 (Stats Container):
├── Speed: 0-9999
├── Stamina: 0-9999
├── Power: 0-9999
├── Guts: 0-9999
└── Wisdom: 0-9999
```

**Mỗi stat hiển thị:**
- Input số (nhập tay)
- Rating (F → E → D → C → B → A → S → SS → SS+)
- Score (điểm tương ứng)

#### 3. Chọn Star Rating
```
Div3 (Star Rating):
└── Click vào 1-5 sao
```

**Stars ảnh hưởng:**
- Unique Skill score (180, 200, 220, 240, 260)
- Overall rating multiplier

#### 4. Chọn Unique Skill Level
```
Div6 (Unique Skill):
├── Skill name (tự động từ Uma)
├── Description (mô tả skill)
├── Level dropdown (1-6)
└── Score (tự động tính)
```

#### 5. Điều chỉnh Aptitudes
```
Div7 (Race Config):

Track (Loại đường đua):
├── Turf (Sân cỏ): S-A / B-C / D-E-F / G
└── Dirt (Sân đất): S-A / B-C / D-E-F / G

Distance (Cự ly):
├── Sprint (Ngắn): S-A / B-C / D-E-F / G
├── Mile (Trung): S-A / B-C / D-E-F / G
├── Medium (Trung dài): S-A / B-C / D-E-F / G
└── Long (Dài): S-A / B-C / D-E-F / G

Style (Phong cách):
├── Front (Dẫn đầu): S-A / B-C / D-E-F / G
├── Pace (Theo kịp): S-A / B-C / D-E-F / G
├── Late (Nước rút): S-A / B-C / D-E-F / G
└── End (Cán đích): S-A / B-C / D-E-F / G
```

**Aptitudes hoạt động:**
- **S-A**: 100% điểm (tốt nhất)
- **B-C**: 80% điểm (khá)
- **D-E-F**: 60% điểm (trung bình)
- **G**: 50% điểm (kém)

#### 6. Thêm Skills
```
Div5 (Skills List):
├── [Add Skill] button
└── Skill rows:
    ├── Color dropdown (IUS, Golden, Yellow, Red, Green, Blue, Purple)
    ├── Skill dropdown (sorted alphabetically)
    ├── Score (auto-calculated)
    └── [×] Remove button
```

**Skills được sắp xếp theo alphabet** để dễ tìm!

**Skill scoring:**
- Base score từ database
- × Aptitude multiplier (dựa trên check_type)
- × Rating level (good/average/bad/terrible)

#### 7. Xem kết quả
```
Div8 (Summary):
├── Rating: F → SS+
├── Total Score: Tổng điểm tất cả
├── Stats Score: Điểm từ 5 stats
├── Skills Score: Điểm từ skills
└── Unique Skill Score: Điểm từ unique skill
```

### Tips sử dụng

✅ **Chọn Uma trước** → Aptitudes tự động điền  
✅ **Skills sắp xếp alphabet** → Dễ tìm kiếm  
✅ **Manual override** → Có thể tự điều aptitudes sau khi auto-fill  
✅ **Real-time update** → Điểm cập nhật ngay khi thay đổi  
✅ **Console log (F12)** → Xem debug info nếu có vấn đề  

---

## Hướng dẫn quản lý Skills

### Cấu trúc thư mục Skills

```
libs/
├── skills_index.json        # Metadata: paths và counts
├── skills_lib.json          # Master file (439 skills merged)
├── skills/                  # Thư mục chính - EDIT HERE
│   ├── ius.json            # 57 Inherited/Unique Skills
│   ├── golden.json         # 114 Golden skills
│   ├── yellow.json         # 106 Yellow skills
│   ├── red.json            # 30 Red skills (debuffs)
│   ├── green.json          # 74 Green skills (aptitude)
│   ├── blue.json           # 26 Blue skills
│   └── purple.json         # 32 Purple skills (negative)
├── tsv/                     # TSV files cho Excel
│   ├── ius_skills.tsv
│   ├── golden_skills.tsv
│   └── ... (7 files)
├── scripts/                 # Python tools
│   ├── split_skills.py     # Master → colors
│   ├── merge_skills.py     # Colors → master
│   ├── validate_skills.py  # Kiểm tra lỗi
│   └── import_from_tsv.py  # TSV ↔ JSON
└── tsv.bat                  # Windows helper
```

### Phương pháp 1: Edit JSON trực tiếp (Nhỏ)

**Thích hợp cho:** Sửa 1-5 skills, fix typos

#### Thêm skill mới

1. Mở file màu tương ứng: `libs/skills/<color>.json`
2. Copy skill cuối cùng
3. Thay đổi:
   ```json
   {
     "id": 440,                    // ID mới (tăng dần)
     "name": "Tên Skill Mới",
     "base": 500,
     "good": 500,
     "average": 410,
     "bad": 364,
     "terrible": 318,
     "check_type": "Late"
   }
   ```
4. Lưu file
5. Validate: `python validate_skills.py`
6. Merge: `python merge_skills.py`
7. Test trong browser

#### Sửa skill hiện có

1. Tìm skill trong file (Ctrl+F)
2. Sửa giá trị cần thay đổi
3. Lưu file
4. Validate và merge

#### Xóa skill

1. Tìm và xóa object skill
2. Kiểm tra không còn dấu phẩy dư
3. Lưu, validate, merge

### Phương pháp 2: Edit qua TSV/Excel (Hàng loạt)

**Thích hợp cho:** Sửa 10+ skills, bulk update, dùng Excel

#### Workflow cơ bản

```cmd
cd libs

# 1. Export ra TSV
tsv.bat export golden

# 2. Edit tsv\golden_skills.tsv trong Excel
#    - Mở file .tsv
#    - Sửa các cột: name, base, good, average, bad, terrible, check_type
#    - Save (Ctrl+S)

# 3. Import lại
tsv.bat import golden_skills.tsv golden update

# 4. Validate
python validate_skills.py

# 5. Kiểm tra kết quả
# - 0 errors = OK!
```

#### Import modes

```bash
# update: Update skills trùng name + add mới
tsv.bat import file.tsv golden update

# replace: Xóa hết và thay bằng file TSV
tsv.bat import file.tsv golden replace

# add: Chỉ thêm skills mới (không update cũ)
tsv.bat import file.tsv golden add
```

#### Format TSV trong Excel

| Column | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| name | Tên skill | "Speed Up" |
| base | Điểm cơ bản | 500 |
| good | Điểm khi aptitude S-A | 500 |
| average | Điểm khi aptitude B-C | 410 |
| bad | Điểm khi aptitude D-E-F | 364 |
| terrible | Điểm khi aptitude G | 318 |
| check_type | Loại check | "Late" |

#### Tips Excel

- **Mở TSV**: Double-click file → Opens in Excel
- **Lưu TSV**: File → Save As → Text (Tab delimited)
- **Format số**: Chọn cột → Format Cells → Number
- **Auto-fill**: Nhập công thức → Drag xuống
- **Find/Replace**: Ctrl+H

#### Ví dụ thực tế

**VD1: Tăng điểm tất cả golden skills 10%**
```cmd
tsv.bat export golden
# Excel: Tạo cột mới = base * 1.1
# Copy → Paste Values → Xóa cột cũ
tsv.bat import golden_skills.tsv golden replace
```

**VD2: Thêm 20 yellow skills mới**
```cmd
tsv.bat export yellow
# Excel: Thêm 20 rows mới ở cuối
# Điền data
tsv.bat import yellow_skills.tsv yellow add
```

**VD3: Thay đổi check_type hàng loạt**
```cmd
tsv.bat export blue
# Excel: Find & Replace (Ctrl+H)
#   Find: "Late" → Replace: "End"
tsv.bat import blue_skills.tsv blue update
```

### Phương pháp 3: Python Scripts (Advanced)

#### Validate skills

```bash
cd libs
python validate_skills.py
```

**Output mong đợi:**
```
✅ Validated 439 skills across 7 colors
✅ 0 errors found
⚠️ 0 warnings
```

**Lỗi thường gặp:**
- Duplicate IDs
- Duplicate names
- Missing required fields
- Invalid check_type

#### Merge colors → master

```bash
cd libs
python merge_skills.py
```

**Tạo:**
- `skills_lib.json` (439 skills merged)
- `skills_index.json` (metadata updated)
- Backup: `skills_lib.json.backup.YYYYMMDD_HHMMSS`

#### Split master → colors

```bash
cd libs
python split_skills.py
```

**Khi nào dùng:**
- Restore từ backup
- Reorganize skills structure

---

## Cấu trúc dữ liệu

### Skill Object (JSON)

```json
{
  "id": 123,
  "name": "Ace of Diamonds",
  "base": 550,
  "good": 550,
  "average": 450,
  "bad": 400,
  "terrible": 350,
  "check_type": "Late"
}
```

### Uma Object (uma_musume.json)

```json
{
  "id": 1,
  "name": "Agnes Tachyon",
  "image": "assets/avatars/agnes_tachyon.png",
  "unique_skills": ["U=ma2"],
  "description": "Mô tả Uma (optional)"
}
```

### Aptitude Object (aptitudes.json)

```json
{
  "Agnes Tachyon": {
    "Turf": "S-A",
    "Dirt": "G",
    "Sprint": "G",
    "Mile": "D-E-F",
    "Medium": "S-A",
    "Long": "B-C",
    "Front": "D-E-F",
    "Pace": "S-A",
    "Late": "B-C",
    "End": "D-E-F"
  }
}
```

### Check Types

| Check Type | Nghĩa | Ánh xạ aptitude |
|------------|-------|-----------------|
| Front | Dẫn đầu | front |
| Pace | Theo kịp | pace |
| Late | Nước rút | late |
| End | Cán đích | end |
| Sprint | Cự ly ngắn | sprint |
| Mile | Cự ly mile | mile |
| Medium | Cự ly trung | medium |
| Long | Cự ly dài | long |
| Turf | Sân cỏ | turf |
| Dirt | Sân đất | dirt |

---

## Công cụ và Scripts

### tsv.bat (Windows Helper)

```cmd
# Export một màu
tsv.bat export golden

# Export tất cả
tsv.bat exportall

# Import (mode: update)
tsv.bat import golden_skills.tsv golden

# Import mode khác
tsv.bat import file.tsv color replace
tsv.bat import file.tsv color add
```

### import_from_tsv.py (Cross-platform)

```bash
# Export
python import_from_tsv.py export <color>

# Import với mode
python import_from_tsv.py import <file>.tsv <color> <mode>

# Modes: update, replace, add
```

### validate_skills.py

```bash
python validate_skills.py

# Output:
# ✅ 0 errors (MUST BE ZERO!)
# ⚠️ X warnings (OK)
# 📊 439 skills validated
```

### merge_skills.py

```bash
python merge_skills.py

# Tạo:
# - libs/skills_lib.json (master)
# - libs/skills_index.json (metadata)
# - backup file
```

### split_skills.py

```bash
python split_skills.py

# Tách skills_lib.json thành 7 files trong skills/
```

---

## Tham khảo nhanh

### Lệnh thường dùng

```bash
# Navigate
cd libs

# Validate
python validate_skills.py

# Export TSV
tsv.bat export golden

# Import TSV
tsv.bat import golden_skills.tsv golden update

# Merge to master
python merge_skills.py
```

### Hotkeys (VS Code)

- `Ctrl+F`: Tìm trong file
- `Ctrl+Shift+F`: Tìm trong workspace
- `Ctrl+G`: Đi đến dòng số X
- `Shift+Alt+F`: Format JSON
- `F2`: Rename symbol
- `Ctrl+Space`: Auto-complete

### Checklist khi edit

- [ ] Backup (optional, git lưu history)
- [ ] Tìm đúng file/skill
- [ ] Sửa giá trị
- [ ] Lưu file
- [ ] Validate: `python validate_skills.py`
- [ ] Merge: `python merge_skills.py` (nếu cần)
- [ ] Test trong browser
- [ ] Commit git (nếu OK)

### File paths nhanh

```
🎯 EDIT HERE:
├── libs/skills/*.json         (Skills data)
├── assets/data/uma_musume.json (Uma data)
└── assets/data/aptitudes.json  (Aptitudes)

📖 READ ONLY:
├── libs/skills_lib.json       (Master backup)
└── libs/skills_index.json     (Metadata)

🛠️ TOOLS:
└── libs/scripts/*.py          (Python tools)
```

### Màu Skills

| Màu | Code | Count | Use Case |
|-----|------|-------|----------|
| IUS | ius | 57 | Inherited/Unique Skills |
| Golden | golden | 114 | Tier 1 skills |
| Yellow | yellow | 106 | Tier 2 skills |
| Red | red | 30 | Debuffs |
| Green | green | 74 | Aptitude-based |
| Blue | blue | 26 | Support |
| Purple | purple | 32 | Negative/Penalty |

---

## Xử lý lỗi

### Lỗi 1: Skills không load

**Triệu chứng:**
- Dropdown skills trống
- Console error: "Failed to load skills"

**Giải pháp:**
```
1. F12 → Console → Xem error message
2. Check file tồn tại:
   - libs/skills_index.json
   - libs/skills/*.json
3. Validate JSON:
   python validate_skills.py
4. Clear cache: Ctrl+Shift+R
5. Check network tab (F12 → Network)
```

### Lỗi 2: Validation fails

**Triệu chứng:**
```
❌ Found X errors:
- Duplicate ID: 123 in golden.json and yellow.json
- Missing field "base" in skill "Speed Up"
```

**Giải pháp:**
```
1. Đọc error message kỹ
2. Mở file bị lỗi
3. Fix theo error:
   - Duplicate ID → Đổi ID thành unique
   - Missing field → Thêm field còn thiếu
4. Re-validate:
   python validate_skills.py
5. Repeat until 0 errors
```

### Lỗi 3: TSV import fail

**Triệu chứng:**
```
⚠️ 0 skills matched
✅ 0 skills added
✅ 0 skills updated
```

**Giải pháp:**
```
1. Check encoding: UTF-8
2. Check delimiter: TAB (not comma/space)
3. Check column names match:
   name, base, good, average, bad, terrible, check_type
4. Check skill names exact match (case-sensitive)
5. Try mode: replace (if safe to overwrite)
```

### Lỗi 4: Aptitudes không tự động điền

**Triệu chứng:**
- Chọn Uma nhưng aptitudes không thay đổi

**Giải pháp:**
```
1. F12 → Console → Check errors
2. Verify AptitudeSystem loaded:
   - Console: "✅ Aptitudes data loaded"
3. Check Uma name khớp với aptitudes.json
4. Check variants:
   - "Air Groove (Wedding)" → Base name "Air Groove"
5. Manual override: Có thể tự điền aptitudes
```

### Lỗi 5: Skill điểm không đúng

**Triệu chứng:**
- Skill score = 0
- Skill score không đổi khi thay aptitude

**Giải pháp:**
```
1. Check skill có check_type
2. Check check_type match với aptitude field
3. Check aptitude dropdown có giá trị
4. Console log: Skill aptitude adjustment
5. Reload page: Ctrl+Shift+R
```

### Lỗi 6: JSON syntax error

**Triệu chứng:**
```
SyntaxError: Unexpected token } in JSON
```

**Giải pháp:**
```
1. Dùng JSONLint.com validate
2. Check:
   - Dấu phẩy dư thừa
   - Thiếu dấu phẩy
   - Thiếu ngoặc {}, []
   - Thiếu dấu ngoặc kép ""
3. Use VS Code:
   - Shift+Alt+F để auto-format
   - Red underline = syntax error
```

### Debug tips

```javascript
// Browser console (F12)

// Check data loaded
console.log(window.DataManager.getUmaMusumeData());
console.log(window.AptitudeSystem.getAptitudesData());

// Check current state
console.log(window.DataManager.getCurrentUma());
console.log(window.StarRating.getCurrentStarRating());

// Manual trigger
window.AptitudeSystem.applyAptitudesToUI("Agnes Tachyon");
window.SkillSystem.updateAllSkillScores();
window.OverallScore.updateOverallScore();
```

---

## Liên hệ & Hỗ trợ

### Tài liệu

- File này: `docs/HUONG_DAN.md`
- Skills README: `libs/README.md`
- TSV Guide: `libs/TSV_QUICK_START.md`

### Tools

- [JSONLint](https://jsonlint.com/) - Validate JSON
- [VS Code](https://code.visualstudio.com/) - Editor
- [Python 3](https://www.python.org/) - Scripts

### Contact

- **Facebook**: [HCruneeyes](https://www.facebook.com/HCruneeyes)
- **Email**: anhtienle428@gmail.com
- **GitHub**: [uma-musume-calculator](https://github.com/runeeyes584/uma-musume-calculator)

---

## Changelog

### Version 2.0 (2025-12-02)
- ✅ Thêm 77 skills mới (362→439)
- ✅ Aptitude system (S-A, B-C, D-E-F, G)
- ✅ Auto-adjustment theo Uma
- ✅ 58 Uma Musume + variants
- ✅ Unique skills cho từng Uma
- ✅ Skills sorted alphabetically
- ✅ TSV workflow hoàn chỉnh

### Version 1.0
- Initial release
- 362 skills, 13 Uma Musume
- Basic calculator functionality

---

**🐎 Chúc bạn tính toán vui vẻ! ✨**
