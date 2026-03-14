#!/bin/bash

echo "========================================"
echo "Moving study_model.pkl to ml-service"
echo "========================================"
echo ""

if [ -f "study_model.pkl" ]; then
    echo "Found study_model.pkl in root directory"
    mv study_model.pkl ml-service/study_model.pkl
    echo ""
    echo "✅ Model moved successfully!"
    echo ""
    echo "New location: ml-service/study_model.pkl"
else
    echo "❌ study_model.pkl not found in root directory"
    echo ""
    if [ -f "ml-service/study_model.pkl" ]; then
        echo "✅ Model already exists in ml-service folder"
    else
        echo "❌ Model not found anywhere!"
    fi
fi

echo ""
echo "========================================"
