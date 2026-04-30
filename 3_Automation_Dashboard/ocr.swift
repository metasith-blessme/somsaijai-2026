import Foundation
import AppKit
import Vision

guard CommandLine.arguments.count > 1 else {
    print("Usage: ocr.swift <image_path>")
    exit(1)
}

let imagePath = CommandLine.arguments[1]
guard let image = NSImage(contentsOfFile: imagePath),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    print("Failed to load image: \(imagePath)")
    exit(1)
}

let request = VNRecognizeTextRequest { (request, error) in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for observation in observations {
        guard let topCandidate = observation.topCandidates(1).first else { continue }
        print(topCandidate.string)
    }
}

// Swift Vision natively supports Thai starting macOS 11/12+? We can try without setting language, or set to "th"
request.recognitionLanguages = ["th-TH", "en-US"]
request.recognitionLevel = .accurate

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
    try handler.perform([request])
} catch {
    print("Error: \(error)")
}
