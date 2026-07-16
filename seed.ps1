$api = "http://localhost:8081/api"
$headers = @{}

# Login as admin
$body = @{email="garbatoyin808@gmail.com";password="Olohuntoyin360"} | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$api/auth/login" -Method POST -Body $body -ContentType "application/json"
$headers.Authorization = "Bearer $($r.token)"
Write-Output "Logged in as admin"

function Create-Category($name, $slug) {
    $body = @{name=$name;slug=$slug;imageUrl=""} | ConvertTo-Json
    try {
        $r = Invoke-RestMethod -Uri "$api/categories" -Method POST -Body $body -ContentType "application/json" -Headers $headers
        Write-Output "  + Category: $name"
        return $r.id
    } catch {
        Write-Output "  x Category $name failed: $($_.Exception.Message)"
        return $null
    }
}

function Create-Product($name, $brand, $desc, $price, $categoryId, $img, $variants) {
    $body = @{
        name=$name; brand=$brand; description=$desc; basePrice=$price
        categoryId=$categoryId; coverImageUrl=$img
        variants=$variants
    } | ConvertTo-Json -Depth 4
    try {
        $r = Invoke-RestMethod -Uri "$api/products" -Method POST -Body $body -ContentType "application/json" -Headers $headers
        Write-Output "  + Product: $name"
        return $r
    } catch {
        Write-Output "  x Product $name failed: $($_.Exception.Message)"
        return $null
    }
}

# ===== CATEGORIES =====
Write-Output "`nCreating categories..."

$mensFashion = Create-Category "Men's Fashion" "mens-fashion"
$womensFashion = Create-Category "Women's Fashion" "womens-fashion"
$children = Create-Category "Children" "children"
$footwear = Create-Category "Footwear" "footwear"
$accessories = Create-Category "Accessories" "accessories"
$sports = Create-Category "Sports & Outdoors" "sports-outdoors"
$traditional = Create-Category "Traditional Wear" "traditional-wear"
$bags = Create-Category "Bags & Luggage" "bags-luggage"
$beauty = Create-Category "Beauty & Personal Care" "beauty-care"

# ===== PRODUCTS =====
Write-Output "`nCreating products..."

# Men's Fashion
Create-Product "Classic Oxford Shirt" "Oxford" "Premium cotton oxford shirt, perfect for casual and formal occasions" 45.99 $mensFashion "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" @(
    @{size="S";color="White";price=45.99;stockQty=20;sku="OXF-WHT-S"}
    @{size="M";color="White";price=45.99;stockQty=25;sku="OXF-WHT-M"}
    @{size="L";color="White";price=45.99;stockQty=15;sku="OXF-WHT-L"}
    @{size="S";color="Blue";price=47.99;stockQty=18;sku="OXF-BLU-S"}
    @{size="M";color="Blue";price=47.99;stockQty=22;sku="OXF-BLU-M"}
)

Create-Product "Slim Fit Chinos" "UrbanFit" "Comfortable stretch chino pants with modern slim fit" 35.99 $mensFashion "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400" @(
    @{size="30";color="Khaki";price=35.99;stockQty=15;sku="CHN-KHA-30"}
    @{size="32";color="Khaki";price=35.99;stockQty=20;sku="CHN-KHA-32"}
    @{size="34";color="Khaki";price=35.99;stockQty=12;sku="CHN-KHA-34"}
    @{size="32";color="Navy";price=36.99;stockQty=18;sku="CHN-NAV-32"}
    @{size="34";color="Navy";price=36.99;stockQty=14;sku="CHN-NAV-34"}
)

Create-Product "Casual Blazer" "TailorPro" "Lightweight unlined blazer for smart casual looks" 89.99 $mensFashion "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" @(
    @{size="M";color="Charcoal";price=89.99;stockQty=10;sku="BLZ-CHA-M"}
    @{size="L";color="Charcoal";price=89.99;stockQty=15;sku="BLZ-CHA-L"}
    @{size="XL";color="Charcoal";price=89.99;stockQty=8;sku="BLZ-CHA-XL"}
)

Create-Product "Graphic T-Shirt" "StreetWear" "100% cotton graphic tee with modern streetwear designs" 19.99 $mensFashion "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400" @(
    @{size="S";color="Black";price=19.99;stockQty=30;sku="TEE-BLK-S"}
    @{size="M";color="Black";price=19.99;stockQty=35;sku="TEE-BLK-M"}
    @{size="L";color="Black";price=19.99;stockQty=25;sku="TEE-BLK-L"}
    @{size="M";color="White";price=19.99;stockQty=30;sku="TEE-WHT-M"}
)

Create-Product "Denim Jacket" "RawDenim" "Classic denim jacket with a modern twist" 65.99 $mensFashion "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400" @(
    @{size="M";color="Light Blue";price=65.99;stockQty=12;sku="DNM-LBL-M"}
    @{size="L";color="Light Blue";price=65.99;stockQty=18;sku="DNM-LBL-L"}
    @{size="XL";color="Light Blue";price=65.99;stockQty=10;sku="DNM-LBL-XL"}
    @{size="M";color="Dark Blue";price=68.99;stockQty=14;sku="DNM-DBL-M"}
)

# Women's Fashion
Create-Product "Floral Maxi Dress" "Elegance" "Beautiful floral print maxi dress, perfect for summer occasions" 54.99 $womensFashion "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400" @(
    @{size="S";color="Multicolor";price=54.99;stockQty=15;sku="MAX-MUL-S"}
    @{size="M";color="Multicolor";price=54.99;stockQty=20;sku="MAX-MUL-M"}
    @{size="L";color="Multicolor";price=54.99;stockQty=12;sku="MAX-MUL-L"}
)

Create-Product "Tailored Blazer" "LadyPro" "Professional tailored blazer for the modern woman" 79.99 $womensFashion "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" @(
    @{size="S";color="Black";price=79.99;stockQty=10;sku="WBLZ-BLK-S"}
    @{size="M";color="Black";price=79.99;stockQty=15;sku="WBLZ-BLK-M"}
    @{size="L";color="Black";price=79.99;stockQty=8;sku="WBLZ-BLK-L"}
)

Create-Product "High-Waist Jeans" "CurveFit" "Stretchy high-waist jeans with tummy control" 42.99 $womensFashion "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" @(
    @{size="6";color="Blue";price=42.99;stockQty=20;sku="HWJ-BLU-6"}
    @{size="8";color="Blue";price=42.99;stockQty=25;sku="HWJ-BLU-8"}
    @{size="10";color="Blue";price=42.99;stockQty=18;sku="HWJ-BLU-10"}
    @{size="12";color="Blue";price=42.99;stockQty=12;sku="HWJ-BLU-12"}
)

Create-Product "Silk Blouse" "SilkWay" "Luxurious silk blouse with pearl buttons" 49.99 $womensFashion "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" @(
    @{size="S";color="Cream";price=49.99;stockQty=12;sku="SILK-CRM-S"}
    @{size="M";color="Cream";price=49.99;stockQty=18;sku="SILK-CRM-M"}
    @{size="M";color="Pink";price=51.99;stockQty=10;sku="SILK-PNK-M"}
)

Create-Product "Knit Sweater" "CozyWear" "Warm cable-knit sweater for cold weather" 44.99 $womensFashion "https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?w=400" @(
    @{size="S";color="Beige";price=44.99;stockQty=15;sku="SWT-BGE-S"}
    @{size="M";color="Beige";price=44.99;stockQty=22;sku="SWT-BGE-M"}
    @{size="L";color="Beige";price=44.99;stockQty=10;sku="SWT-BGE-L"}
)

# Children
Create-Product "Kids Cartoon T-Shirt" "MiniMe" "Fun cartoon print t-shirt for kids" 14.99 $children "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400" @(
    @{size="4-5";color="Blue";price=14.99;stockQty=25;sku="KTS-BLU-4"}
    @{size="6-7";color="Blue";price=14.99;stockQty=30;sku="KTS-BLU-6"}
    @{size="8-9";color="Blue";price=14.99;stockQty=20;sku="KTS-BLU-8"}
)

Create-Product "Kids Jogger Set" "PlayFit" "Comfortable 2-piece jogger set for active kids" 24.99 $children "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400" @(
    @{size="4-5";color="Gray";price=24.99;stockQty=20;sku="JGS-GRY-4"}
    @{size="6-7";color="Gray";price=24.99;stockQty=25;sku="JGS-GRY-6"}
    @{size="8-9";color="Gray";price=24.99;stockQty=15;sku="JGS-GRY-8"}
)

# Footwear
Create-Product "Running Sneakers" "AirStep" "Lightweight running shoes with cushioned sole" 89.99 $footwear "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" @(
    @{size="40";color="Black/White";price=89.99;stockQty=15;sku="RUN-BW-40"}
    @{size="41";color="Black/White";price=89.99;stockQty=20;sku="RUN-BW-41"}
    @{size="42";color="Black/White";price=89.99;stockQty=25;sku="RUN-BW-42"}
    @{size="43";color="Black/White";price=89.99;stockQty=18;sku="RUN-BW-43"}
    @{size="44";color="Black/White";price=89.99;stockQty=12;sku="RUN-BW-44"}
)

Create-Product "Leather Loafers" "Mocassin" "Premium leather loafers for office and formal wear" 74.99 $footwear "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400" @(
    @{size="40";color="Brown";price=74.99;stockQty=10;sku="LOF-BRN-40"}
    @{size="41";color="Brown";price=74.99;stockQty=15;sku="LOF-BRN-41"}
    @{size="42";color="Brown";price=74.99;stockQty=12;sku="LOF-BRN-42"}
    @{size="43";color="Brown";price=74.99;stockQty=8;sku="LOF-BRN-43"}
)

Create-Product "High Heel Pumps" "Glamour" "Elegant stiletto heel pumps for special occasions" 59.99 $footwear "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400" @(
    @{size="36";color="Red";price=59.99;stockQty=12;sku="PUMP-RED-36"}
    @{size="37";color="Red";price=59.99;stockQty=15;sku="PUMP-RED-37"}
    @{size="38";color="Red";price=59.99;stockQty=10;sku="PUMP-RED-38"}
    @{size="37";color="Black";price=59.99;stockQty=18;sku="PUMP-BLK-37"}
)

Create-Product "Casual Sandals" "BeachWalk" "Comfortable slide sandals for everyday wear" 29.99 $footwear "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=400" @(
    @{size="39";color="Brown";price=29.99;stockQty=25;sku="SND-BRN-39"}
    @{size="40";color="Brown";price=29.99;stockQty=30;sku="SND-BRN-40"}
    @{size="41";color="Brown";price=29.99;stockQty=22;sku="SND-BRN-41"}
    @{size="42";color="Brown";price=29.99;stockQty=18;sku="SND-BRN-42"}
)

# Accessories
Create-Product "Leather Belt" "BeltCo" "Genuine leather belt with brushed buckle" 34.99 $accessories "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" @(
    @{size="90cm";color="Brown";price=34.99;stockQty=25;sku="BELT-BRN-90"}
    @{size="100cm";color="Brown";price=34.99;stockQty=30;sku="BELT-BRN-100"}
    @{size="90cm";color="Black";price=34.99;stockQty=20;sku="BELT-BLK-90"}
    @{size="100cm";color="Black";price=34.99;stockQty=28;sku="BELT-BLK-100"}
)

Create-Product "Sunglasses" "VisionPro" "Polarized UV400 protection sunglasses" 49.99 $accessories "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" @(
    @{size="Standard";color="Black";price=49.99;stockQty=35;sku="SUN-BLK-STD"}
    @{size="Standard";color="Tortoise";price=52.99;stockQty=20;sku="SUN-TRT-STD"}
    @{size="Standard";color="Gold";price=55.99;stockQty=15;sku="SUN-GLD-STD"}
)

Create-Product "Wrist Watch" "TimeCraft" "Elegant analog watch with leather strap" 129.99 $accessories "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" @(
    @{size="Standard";color="Silver/Black";price=129.99;stockQty=10;sku="WCH-SLB-STD"}
    @{size="Standard";color="Gold/Brown";price=149.99;stockQty=8;sku="WCH-GDB-STD"}
)

# Sports & Outdoors
Create-Product "Yoga Mat" "FlexFit" "Non-slip exercise yoga mat with carrying strap" 29.99 $sports "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400" @(
    @{size="Standard";color="Purple";price=29.99;stockQty=40;sku="YOG-PUR-STD"}
    @{size="Standard";color="Blue";price=29.99;stockQty=35;sku="YOG-BLU-STD"}
    @{size="Thick";color="Purple";price=39.99;stockQty=20;sku="YOG-PUR-THK"}
)

Create-Product "Sports Water Bottle" "HydroMax" "Insulated stainless steel water bottle 750ml" 19.99 $sports "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400" @(
    @{size="750ml";color="Black";price=19.99;stockQty=50;sku="BOT-BLK-750"}
    @{size="750ml";color="White";price=19.99;stockQty=45;sku="BOT-WHT-750"}
    @{size="1L";color="Black";price=24.99;stockQty=30;sku="BOT-BLK-1L"}
)

# Traditional Wear
Create-Product "Agbada" "Heritage" "Premium quality flowing agbada with matching cap" 149.99 $traditional "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400" @(
    @{size="M";color="Gold/Blue";price=149.99;stockQty=8;sku="AGB-GLB-M"}
    @{size="L";color="Gold/Blue";price=149.99;stockQty=12;sku="AGB-GLB-L"}
    @{size="XL";color="Gold/Blue";price=149.99;stockQty=10;sku="AGB-GLB-XL"}
    @{size="L";color="Green/Red";price=159.99;stockQty=6;sku="AGB-GNR-L"}
)

Create-Product "Kaftan Top" "AfroChic" "Comfortable African print kaftan top" 39.99 $traditional "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" @(
    @{size="M";color="Multi";price=39.99;stockQty=15;sku="KAF-MUL-M"}
    @{size="L";color="Multi";price=39.99;stockQty=20;sku="KAF-MUL-L"}
    @{size="XL";color="Multi";price=39.99;stockQty=12;sku="KAF-MUL-XL"}
)

# Bags & Luggage
Create-Product "Travel Backpack" "Voyager" "Spacious 40L travel backpack with USB charging port" 59.99 $bags "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" @(
    @{size="40L";color="Black";price=59.99;stockQty=25;sku="BPK-BLK-40"}
    @{size="40L";color="Gray";price=59.99;stockQty=20;sku="BPK-GRY-40"}
    @{size="40L";color="Navy";price=62.99;stockQty=15;sku="BPK-NAV-40"}
)

Create-Product "Tote Bag" "UrbanBag" "Stylish canvas tote bag for everyday use" 34.99 $bags "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" @(
    @{size="Medium";color="Natural";price=34.99;stockQty=30;sku="TOT-NAT-MED"}
    @{size="Medium";color="Black";price=34.99;stockQty=25;sku="TOT-BLK-MED"}
    @{size="Large";color="Natural";price=39.99;stockQty=18;sku="TOT-NAT-LRG"}
)

# Beauty & Personal Care
Create-Product "Perfume Gift Set" "Aroma" "Luxury perfume gift set with 3 signature scents" 79.99 $beauty "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400" @(
    @{size="50ml";color="N/A";price=79.99;stockQty=20;sku="PRF-50-3PK"}
    @{size="100ml";color="N/A";price=129.99;stockQty=12;sku="PRF-100-3PK"}
)

Create-Product "Skincare Kit" "GlowUp" "Complete 5-piece skincare routine kit" 49.99 $beauty "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400" @(
    @{size="Standard";color="N/A";price=49.99;stockQty=30;sku="SKN-STD-5PC"}
)

Write-Output "`n=== SEEDING COMPLETE ==="
