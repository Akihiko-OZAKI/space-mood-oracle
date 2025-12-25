-- ============================================
-- 宇宙天気データ確認用SQLクエリ集
-- ============================================

-- 1. 全データを日付順で表示（最新順）
SELECT 
    id,
    date AS '日付',
    kp_index_max AS 'Kp指数（最大）',
    x_class_flare_count AS 'Xクラスフレア回数',
    m_class_flare_count AS 'Mクラスフレア回数',
    solar_wind_speed AS '太陽風速度 (km/s)',
    proton_flux AS 'プロトンフラックス (pfu)',
    solar_radiation_scale AS '太陽放射スケール (S-scale)',
    createdAt AS '作成日時',
    updatedAt AS '更新日時'
FROM space_weather_data
ORDER BY date DESC;

-- 2. 最新10件を表示
SELECT 
    date AS '日付',
    kp_index_max AS 'Kp指数',
    x_class_flare_count AS 'Xフレア',
    m_class_flare_count AS 'Mフレア',
    solar_wind_speed AS '太陽風速度',
    proton_flux AS 'プロトンフラックス',
    solar_radiation_scale AS 'Sスケール'
FROM space_weather_data
ORDER BY date DESC
LIMIT 10;

-- 3. 最近30日分を表示
SELECT 
    date AS '日付',
    kp_index_max AS 'Kp指数',
    x_class_flare_count AS 'Xフレア',
    m_class_flare_count AS 'Mフレア',
    solar_wind_speed AS '太陽風速度',
    proton_flux AS 'プロトンフラックス',
    solar_radiation_scale AS 'Sスケール'
FROM space_weather_data
WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY date DESC;

-- 4. 今日のデータを表示
SELECT 
    date AS '日付',
    kp_index_max AS 'Kp指数',
    x_class_flare_count AS 'Xフレア',
    m_class_flare_count AS 'Mフレア',
    solar_wind_speed AS '太陽風速度',
    proton_flux AS 'プロトンフラックス',
    solar_radiation_scale AS 'Sスケール',
    createdAt AS '作成日時',
    updatedAt AS '更新日時'
FROM space_weather_data
WHERE date = CURDATE();

-- 5. 指定した日付のデータを表示（例: 2024-12-19）
-- SELECT * FROM space_weather_data WHERE date = '2024-12-19';

-- 6. データ件数を確認
SELECT 
    COUNT(*) AS '総データ件数',
    MIN(date) AS '最古の日付',
    MAX(date) AS '最新の日付'
FROM space_weather_data;

-- 7. Kp指数が高い日（Kp 5以上）を表示
SELECT 
    date AS '日付',
    kp_index_max AS 'Kp指数',
    x_class_flare_count AS 'Xフレア',
    m_class_flare_count AS 'Mフレア',
    solar_wind_speed AS '太陽風速度'
FROM space_weather_data
WHERE CAST(kp_index_max AS DECIMAL(3,1)) >= 5.0
ORDER BY CAST(kp_index_max AS DECIMAL(3,1)) DESC;

-- 8. 太陽フレアが発生した日を表示（XクラスまたはMクラス）
SELECT 
    date AS '日付',
    kp_index_max AS 'Kp指数',
    x_class_flare_count AS 'Xフレア',
    m_class_flare_count AS 'Mフレア',
    solar_wind_speed AS '太陽風速度',
    proton_flux AS 'プロトンフラックス',
    solar_radiation_scale AS 'Sスケール'
FROM space_weather_data
WHERE x_class_flare_count > 0 OR m_class_flare_count > 0
ORDER BY date DESC;

-- 9. 統計情報（平均値、最大値、最小値）
SELECT 
    COUNT(*) AS 'データ件数',
    AVG(CAST(kp_index_max AS DECIMAL(3,1))) AS 'Kp指数平均',
    MAX(CAST(kp_index_max AS DECIMAL(3,1))) AS 'Kp指数最大',
    MIN(CAST(kp_index_max AS DECIMAL(3,1))) AS 'Kp指数最小',
    SUM(x_class_flare_count) AS 'Xフレア総数',
    SUM(m_class_flare_count) AS 'Mフレア総数',
    AVG(CAST(solar_wind_speed AS DECIMAL(10,2))) AS '太陽風速度平均',
    MAX(CAST(solar_wind_speed AS DECIMAL(10,2))) AS '太陽風速度最大'
FROM space_weather_data
WHERE kp_index_max IS NOT NULL AND kp_index_max != '';

-- 10. 月別の統計（最近3ヶ月）
SELECT 
    DATE_FORMAT(date, '%Y-%m') AS '年月',
    COUNT(*) AS 'データ件数',
    AVG(CAST(kp_index_max AS DECIMAL(3,1))) AS 'Kp指数平均',
    SUM(x_class_flare_count) AS 'Xフレア合計',
    SUM(m_class_flare_count) AS 'Mフレア合計'
FROM space_weather_data
WHERE date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
GROUP BY DATE_FORMAT(date, '%Y-%m')
ORDER BY DATE_FORMAT(date, '%Y-%m') DESC;

-- 11. テーブル構造を確認
DESCRIBE space_weather_data;

-- 12. データの存在確認（今日のデータがあるか）
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'データあり'
        ELSE 'データなし'
    END AS '今日のデータ状況',
    COUNT(*) AS '件数'
FROM space_weather_data
WHERE date = CURDATE();

