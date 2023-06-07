// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;

use rand::Rng;
use rusqlite::Connection;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_some_word(handle: tauri::AppHandle) -> String {
    let db_path = handle
        .path_resolver()
        .resolve_resource("dictionary.db")
        .expect("Failed to resolve dictionary db");

    let connection = Connection::open(db_path).unwrap();
    let word_counter: usize = connection
        .prepare("SELECT COUNT(*) FROM WORDS")
        .unwrap()
        .query_row([], |row| row.get(0))
        .unwrap();

    let mut rng = rand::thread_rng();
    let some_index = rng.gen_range(1..word_counter);

    let word = connection
        .prepare("select * from words order by word limit 1 offset :offset")
        .unwrap()
        .query_row(&[(":offset", &some_index)], |row| {
            let word: String = row.get(0).unwrap();
            let word_type: String = row.get(1).unwrap();
            let pronounce: String = row.get(2).unwrap();
            let meaning: String = row.get(3).unwrap();
            return Ok(format!(
                "{} - {} - {} - {}",
                word, word_type, pronounce, meaning
            ));
        })
        .unwrap();

    return word.to_string();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_some_word])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
