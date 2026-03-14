@echo off
echo ========================================
echo Moving study_model.pkl to ml-service
echo ========================================
echo.

if exist study_model.pkl (
    echo Found study_model.pkl in root directory
    move study_model.pkl ml-service\study_model.pkl
    echo.
    echo ✅ Model moved successfully!
    echo.
    echo New location: ml-service\study_model.pkl
) else (
    echo ❌ study_model.pkl not found in root directory
    echo.
    if exist ml-service\study_model.pkl (
        echo ✅ Model already exists in ml-service folder
    ) else (
        echo ❌ Model not found anywhere!
    )
)

echo.
echo ========================================
pause
